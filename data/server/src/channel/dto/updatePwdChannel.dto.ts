import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DataTypes } from 'sequelize';

export class updatePwdChannelDto {
  @ApiProperty({
    example: 'chan',
    description: "channel name",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'pwd',
    description: "channel password",
  })
  @IsNotEmpty()
  pwd: string;

}
