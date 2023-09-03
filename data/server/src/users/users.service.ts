import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'db/models/user';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { UniqueConstraintError } from 'sequelize';
import { isUUID } from 'class-validator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PasswordService } from './password.service';
import { UniqueConstraintException, InvalidUUIDException, UserNotFoundException } from 'src/exceptions';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private usersModel: typeof User,
  ) {}

  responseUser(user: User) {
    const { public_id, pseudo, email } = user;
    return { public_id, pseudo, email };
  }

  private attributesToRetrieve = [
    'public_id',
    'pseudo',
    'email',
  ];
  
  async findAll() {
    const users = await User.findAll({
      attributes: this.attributesToRetrieve,
    });
    console.log(users.every((user) => user instanceof User)); // true
    console.log('All users:', JSON.stringify(users, null, 2));
    return users;
  }

  async findOne(id: uuidv4) {
    const public_id = id;
    if (!isUUID(public_id)) 
      throw new InvalidUUIDException();
    const user = await User.findOne({
      where: { public_id },
      attributes: this.attributesToRetrieve,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findByPseudo(pseudo: string) {
    const user = await User.findOne({
      where: { pseudo },
      attributes: this.attributesToRetrieve,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  private handleUniqueConstraintError(error: any) {
    if (error instanceof UniqueConstraintError) {
      const fieldNotUnique = Object.keys(error.fields)[0];
      throw new UniqueConstraintException(fieldNotUnique);
    }
    console.log(error);
    throw new Error(error);
  }
  
  async createUser(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await PasswordService.hashPassword(createUserDto.password);
      const user = await this.usersModel.create({
        public_id: uuidv4(),
        ...createUserDto,
      });
      return this.responseUser(user);
    } catch (error) {
      this.handleUniqueConstraintError(error);
    }
  }
  
  async updateUser(id: uuidv4, updateUserDto: UpdateUserDto) {
    if (!isUUID(id)) 
      throw new InvalidUUIDException();
    if (updateUserDto.password !== undefined)
      updateUserDto.password = await PasswordService.hashPassword(updateUserDto.password);
    try {
      const user = await this.usersModel.update(
        { ...updateUserDto },
        { where: { public_id: id } },
        );
      if (user[0] === 0) {
        throw new UserNotFoundException();
      }
      const UpdatedUser = await this.usersModel.findOne({
        where: { public_id: id },
        attributes: this.attributesToRetrieve,
      });
      return ({ message: user , user: this.responseUser(UpdatedUser) });
    } catch (error) {
      this.handleUniqueConstraintError(error);
    }
  }

  async deleteUser(id: uuidv4) {
    if (!isUUID(id)) 
      throw new InvalidUUIDException();
    const user = await User.destroy({
      where: { public_id: id },
    });
    if (user === 0) {
      throw new UserNotFoundException();
    }
    return user;
  }
}


