import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditChannelDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'chan',
    description: 'channel name',
  })
  chanName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Public',
    description: 'type de channel',
    enum: ['Direct', 'Public', 'Protected', 'Private'],
  })
  chanType: string;

  @IsOptional()
  @ApiProperty({
    example: 'pass',
    description: 'channel password',
  })
  chanPassword: string;

  // TODO add image
}
