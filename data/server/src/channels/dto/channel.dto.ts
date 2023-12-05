import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class channelDto {
  @IsNotEmpty()
  chanId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'chan',
    description: 'channel name',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Public',
    description: 'type de channel',
    enum: ['Direct', 'Public', 'Protected', 'Private'],
  })
  channelType: string;

  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '2',
    description: 'number of users',
  })
  nbUser: number;

  // TODO add image

  constructor(
    chanId: string,
    name: string,
    channelType: string,
    ownerId: string,
    nbUser: number,
  ) {
    this.chanId = chanId;
    this.name = name;
    this.channelType = channelType;
    this.ownerId = ownerId;
    this.nbUser = nbUser;
  }
}
