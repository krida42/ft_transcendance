import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'db/models/user';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { UniqueConstraintError } from 'sequelize';
import { isUUID } from 'class-validator';
import { UpdateUserDto } from './dto/updateUser.dto';

import {
  UniqueConstraintException,
  InvalidUUIDException,
  UserNotFoundException,
} from 'src/exceptions/exceptions';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from './dto/reponseUser.dto';


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
  ) {}


  private attributesToRetrieve = [
    'public_id',
    'email',
    'login',
    'pseudo',
    'image_link',
    'phone',
    'roles',
  ];

  async findAll() {
    const users = await User.findAll({
    });
    // console.log(users.every((user) => user instanceof User));
    // console.log('All users:', JSON.stringify(users, null, 2));
    return users;
  }

  async findById(id: uuidv4) {
    const public_id = id;
    if (!isUUID(public_id)) throw new InvalidUUIDException();
    const user = await User.findOne({
      where: { public_id },
      attributes: this.attributesToRetrieve,
    });
    if (!user) throw new UserNotFoundException();
    return user;
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

  async findOrCreate(userData: any): Promise<ResponseUserDto> {
    const user = await this.findByLogin(userData.login);
    if (!user) {
      const createUserDto = await this.userDataToCreateUserDto(userData);
      return this.createUser(createUserDto);
    } 
    // else 
      // console.log('find :', user.dataValues);
    return await responseUser(user);
  }

  private handleUniqueConstraintError(error: any) {
    if (error instanceof UniqueConstraintError) {
      const fieldNotUnique = Object.keys(error.fields)[0];
      throw new UniqueConstraintException(fieldNotUnique);
    }
    console.log(error);
    throw new Error(error);
  }

  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const user = await this.usersModel.create({
        public_id: uuidv4(),
        ...createUserDto,
      });
      const resUser = await responseUser(user);
      // console.log('create :', responseUser);
      return resUser;
    } catch (error) {
      this.handleUniqueConstraintError(error);
    }
  }

  async updateUser(id: uuidv4, updateUserDto: UpdateUserDto): Promise<{ message: [number], user: ResponseUserDto }> {
    if (!isUUID(id)) 
      throw new InvalidUUIDException();
    try {
      const user = await this.usersModel.update(
        { ...updateUserDto },
        { where: { public_id: id },
        individualHooks: true },
      );
      if (user[0] === 0) {
        throw new UserNotFoundException();
      }
      const UpdatedUser = await this.usersModel.findOne({
        where: { public_id: id },
        attributes: this.attributesToRetrieve,
      });
      return { message: user, user: await responseUser(UpdatedUser) };
    } catch (error) {
      this.handleUniqueConstraintError(error);
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
}
