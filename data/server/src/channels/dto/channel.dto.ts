import { IsNotEmpty, IsOptional } from 'class-validator';

export class channelDto {
  @IsNotEmpty()
  chanId: string;

  @IsNotEmpty()
  chanName: string;

  @IsNotEmpty()
  chanType: string;

  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  nbUser: number;

  @IsOptional()
  imgName: string;


  constructor(
    chanId: string,
    chanName: string,
    chanType: string,
    ownerId: string,
    nbUser: number,
    imgName: string,
  ) {
    this.chanId = chanId;
    this.chanName = chanName;
    this.chanType = chanType;
    this.ownerId = ownerId;
    this.nbUser = nbUser;
    this.imgName = imgName;
  }
}
