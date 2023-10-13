import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueConstraintException extends HttpException {
  constructor(field: string) {
    super(`${field} already exists.`, HttpStatus.CONFLICT);
  }
}

export class InvalidUUIDException extends HttpException {
  constructor() {
    super('Invalid UUID', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid token', HttpStatus.UNAUTHORIZED);
  }
}

export class ExpiredTokenException extends HttpException {
  constructor() {
    super('Expired token', HttpStatus.UNAUTHORIZED);
  }
}
