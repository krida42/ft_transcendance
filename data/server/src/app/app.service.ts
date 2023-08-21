import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(private sequelize: Sequelize) {}
}
