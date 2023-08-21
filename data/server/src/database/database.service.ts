/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

// @Injectable()
export class DatabaseService {
  getHell(): string {
    return 'Hell World!';
  }
}
