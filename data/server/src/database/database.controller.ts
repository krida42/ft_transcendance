/*
https://docs.nestjs.com/controllers#controllers
*/

import { Sequelize } from 'sequelize-typescript';

export class DatabaseController {
  constructor(private sequelize: Sequelize) {}

  async getHell(): Promise<string> {
    return 'Hell World!';
  }
}
