import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PostMsgResponseDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '8784de03-d5454de23ye-d542jde',
    required: true,
  })
  readonly localMsgId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3e803297-6581-4baa-ae07-ab9c601b4991',
    required: true,
  })
  readonly remoteMsgId: string;

  constructor(localMsgId: string, remoteMsgId: string) {
    this.localMsgId = localMsgId;
    this.remoteMsgId = remoteMsgId;
  }
}
