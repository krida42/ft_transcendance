import { IsNotEmpty } from 'class-validator';

export enum Status {
  Online = 'online',
  Offline = 'offline',
  InGame = 'inGame',
}

export class StatusDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  status: Status;

  constructor(userId: string, status: Status) {
    this.userId = userId;
    this.status = status;
  }
}
