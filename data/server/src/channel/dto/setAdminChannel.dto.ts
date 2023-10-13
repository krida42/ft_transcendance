import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DataTypes } from 'sequelize';

export class setAdminChannelDto {
  @ApiProperty({
    example: 'chan',
    description: "channel name",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'someone',
    description: "login to set admin",
  })
  @IsNotEmpty()
  login: string;

}
