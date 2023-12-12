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

  // @IsOptional()
  // imgName: string;

  // @IsOptional()
  // imgType: string;

  @IsOptional()
  imgData: Blob;


  constructor(
    chanId: string,
    chanName: string,
    chanType: string,
    ownerId: string,
    nbUser: number,
    imgData: Blob,
  ) {
    this.chanId = chanId;
    this.chanName = chanName;
    this.chanType = chanType;
    this.ownerId = ownerId;
    this.nbUser = nbUser;
    this.imgData = imgData;
  }
}
