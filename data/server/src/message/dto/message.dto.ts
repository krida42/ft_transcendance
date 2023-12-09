import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Hello world!',
    required: true,
  })
  readonly content: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: true,
    description: 'The id of the message in database',
  })
  readonly msgId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: true,
    description: 'The id of the user in database',
  })
  readonly userId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    example: '2021-07-06T10:18:10.000Z',
    required: true,
    description: 'The date of the message',
  })
  readonly createdAt: Date;

  constructor(content: string, msgId: string, userId: string, createdAt: Date) {
    this.content = content;
    this.msgId = msgId;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
