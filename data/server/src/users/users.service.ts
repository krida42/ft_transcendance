/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDTO } from './dto/users.dto';
import { User } from 'db/models/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private usersModel: typeof User,
  ) {}

  users: UserDTO[] = [
    {
      id: 1,
      username: 'user1',
      email: 'blabla@gmail.com',
    },
  ];

  findAll(): UserDTO[] {
    return this.users;
  }
}
