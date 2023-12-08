import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PasswordChannelDto {
  @IsOptional()
  @ApiProperty({
    example: 'pass',
    description: 'channel password',
  })
  chanPassword!: string;
}
