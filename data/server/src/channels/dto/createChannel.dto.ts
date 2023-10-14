import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DataTypes } from 'sequelize';

export class createChannelDto {
  @ApiProperty({
    example: 'chan',
    description: "channel name",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Public',
    description: "type de channel",
    enum: ['Direct', 'Public', 'Protected', 'Private']
  })
  @IsNotEmpty()
  channelType: string;

  @ApiProperty({
    example: 'pass',
    description: "channel password",
  })
  @IsOptional()
  password: string;

}
