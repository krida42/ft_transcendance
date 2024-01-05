import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'db/models/user';
import { CreateUserDto } from './dto/createUser.dto';
import { uuidv4 } from 'src/types';
import { Op, UniqueConstraintError } from 'sequelize';
import { isUUID } from 'class-validator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { v4 } from 'uuid';
import {
  UniqueConstraintException,
  InvalidUUIDException,
  UserNotFoundException,
} from 'src/exceptions/exceptions';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from './dto/responseUser.dto';
import { Express } from 'express';
import { PublicUserDto } from './dto/publicUser.dto';
import { AchievementsDto } from './dto/achievements.dto';
import { Achievements } from 'db/models/achievements';
import { Games } from 'db/models/games';
import { UserAchievements } from 'db/models/userAchievements';
import { HistoryDto } from './dto/history.dto';

export async function responseUser(user: User) {
  const userDto = plainToClass(ResponseUserDto, user, {
    excludeExtraneousValues: true,
  });
  return userDto;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private usersModel: typeof User,
    @InjectModel(Achievements)
    private readonly achievementsModel: typeof Achievements,
    @InjectModel(UserAchievements)
    private readonly userAchModel: typeof UserAchievements,
    @InjectModel(Games)
    private readonly gamesModel: typeof Games,
  ) {}

  static async userModelToPublicUserDto(user: User) {
    const userDto = plainToClass(PublicUserDto, user, {
      excludeExtraneousValues: true,
    });
    return userDto;
  }

  private attributesToRetrieve = [
    'public_id',
    'email',
    'login',
    'pseudo',
    'avatar',
    'phone',
    'roles',
    'twoFactorEnable',
  ];

  async findAll() {
    const users = await User.findAll({});
    return users;
  }

  async findById(id: uuidv4) {
    const public_id = id;
    if (!isUUID(public_id, 4)) throw new InvalidUUIDException();
    const user = await User.findOne({
      where: { public_id },
      attributes: this.attributesToRetrieve,
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async findByIds(ids: uuidv4[]): Promise<User[]> {
    if (!ids.every((ids) => isUUID(ids, 4))) {
      throw new InvalidUUIDException();
    }

    const users = await User.findAll({
      where: { public_id: ids },
      attributes: this.attributesToRetrieve,
    });

    if (users.length !== ids.length) {
      throw new UserNotFoundException();
    }

    return users;
  }

  async findByPseudo(pseudo: string) {
    const user = await User.findOne({
      where: { pseudo },
      attributes: this.attributesToRetrieve,
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async findByLogin(login: string) {
    const user = await User.findOne({
      where: { login },
      attributes: this.attributesToRetrieve,
    });
    return user;
  }

  async userDataToCreateUserDto(userData: any): Promise<CreateUserDto> {
    if (userData.phone === 'hidden') userData.phone = null;
    const createUserDto = new CreateUserDto(
      userData.id,
      userData.email,
      userData.login,
      userData.login,
      userData.image.link,
      userData.phone,
      userData.roles,
    );
    return createUserDto;
  }

  async findOrCreate(userData: any) {
    const user = await this.findByLogin(userData.login);
    if (!user) {
      const createUserDto = await this.userDataToCreateUserDto(userData);
      return await this.createUser(createUserDto);
    }
    return await responseUser(user);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersModel.create({
        public_id: v4(),
        ...createUserDto,
      });
      const resUser = await responseUser(user);
      return resUser;
    } catch (error) {
      console.error(error);
      throw new HttpException('', HttpStatus.CONFLICT);
    }
  }

  async updateUser(id: uuidv4, updateUserDto: UpdateUserDto) {
    if (!isUUID(id)) throw new InvalidUUIDException();
    try {
      const retUpdateNotSafe = await this.usersModel.update(
        { ...updateUserDto },
        { where: { public_id: id }, individualHooks: true },
      );

      if (retUpdateNotSafe[0] === 0) return [false, null];
      const updatedUser = await this.usersModel.findOne({
        where: { public_id: id },
        attributes: this.attributesToRetrieve,
      });

      return [true, await responseUser(updatedUser!)];
    } catch (error) {
      console.error(error);
      throw new HttpException('Cant update user', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: uuidv4): Promise<number> {
    if (!isUUID(id)) throw new InvalidUUIDException();
    const user = await User.destroy({
      where: { public_id: id },
    });
    if (user === 0) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async deleteAllUsers(): Promise<number> {
    const users = await User.destroy({
      where: {},
    });
    console.log(`${users} users deleted`);
    return users;
  }

  async get2fa(publicId: uuidv4): Promise<boolean> {
    const user = await this.usersModel.findOne({
      where: {
        public_id: publicId,
      },
    });
    if (user?.twoFactorEnable === true) return true;
    return false;
  }

  async getAchievements(publicId: uuidv4): Promise<AchievementsDto[]> {
    const userAchs = await this.userAchModel.findAll({
      where: { public_id: publicId },
    });
    const dtoArray: AchievementsDto[] = [];

    if (!userAchs)
      return dtoArray;

    const achIds = userAchs.map((userAch) => userAch.achievement_id);
    // console.log('achIds', achIds);

    for (const achId of achIds) {
      const data = await this.achievementsModel.findOne({
        where: { id: achId },
      });
      if (!data)
        throw new HttpException(
          'invalid achievement id',
          HttpStatus.BAD_REQUEST,
        );

      let dto = new AchievementsDto(data.name, data.description, data.icon);
      dtoArray.push(dto);
    }
    return dtoArray;
  }

  async getHistory(publicId: uuidv4): Promise<HistoryDto[]> {
    const games = await Games.findAll({
      where: {
        [Op.or]: [{ player1_id: publicId }, { player2_id: publicId }],
      },
    });
    const dtoArray: HistoryDto[] = [];

    if (!games)
      return dtoArray;

    for (const game of games) {
      let opplogin = (await this.findById(game.player1_id)).login;
      let oppScore = game.score1;
      let myScore = game.score2;
      if (game.player1_id == publicId) {
        opplogin = (await this.findById(game.player2_id)).login;
        oppScore = game.score2;
        myScore = game.score1;
      }
      let dto = new HistoryDto(
        opplogin,
        oppScore,
        myScore,
        game.time,
        game.createdAt,
      );
      dtoArray.push(dto);
    }
    return dtoArray;
  }
}
