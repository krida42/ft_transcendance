import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class AddMsgDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
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
    description: 'The id of the message on front to help the front to update',
  })
  readonly msgId: string;

  constructor(content: string, msgId: string) {
    this.content = content;
    this.msgId = msgId;
  }
}
