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

export class InvalidRelationException extends HttpException {
  constructor() {
    super('Invalid friend request', HttpStatus.BAD_REQUEST);
  }
}

export class FriendAlreadyExistsException extends HttpException {
  constructor() {
    super('Friend already registered', HttpStatus.BAD_REQUEST);
  }
}

export class RelationNotFoundException extends HttpException {
  constructor() {
    super('Relation not found', HttpStatus.NOT_FOUND);
  }
}

export class AlreadyBlockedException extends HttpException {
  constructor() {
    super('User already blocked', HttpStatus.BAD_REQUEST);
  }
}

export class ChannelNotFoundException extends HttpException {
  constructor() {
    super('Channel not found', HttpStatus.NOT_FOUND);
  }
}

export class ChannelAlreadyExistsException extends HttpException {
  constructor() {
    super('Channel already exists', HttpStatus.BAD_REQUEST);
  }
}
