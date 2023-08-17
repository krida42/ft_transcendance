/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UsersDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
  users: UsersDTO[] = [
    {
      id: 1,
      username: 'user1',
      email: 'blabla@gmail.com',
    },
  ];

  findAll(): UsersDTO[] {
    return this.users;
  }
}
