import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DataTypes } from 'sequelize';

export class inviteToChannelDto {
  @ApiProperty({
    example: 'chan',
    description: "channel name",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'someone',
    description: "login to invite",
  })
  @IsNotEmpty()
  login: string;

}
