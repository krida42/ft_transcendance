/*
https://docs.nestjs.com/pipes
*/

import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class UsersPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}
