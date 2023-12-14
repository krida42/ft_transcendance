import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class HistoryDto {
  @Expose()
  @IsNotEmpty()
  opponentLogin: string;

  @Expose()
  @IsNotEmpty()
  opponentScore: number;

  @Expose()
  @IsNotEmpty()
  myScore: number;

  @Expose()
  @IsNotEmpty()
  seconds: number;

  @Expose()
  @IsNotEmpty()
  date: Date;

  constructor(
    opponentLogin: string,
    opponentScore: number,
    myScore: number,
    seconds: number,
    date: Date,
  ) {
    this.opponentLogin = opponentLogin;
    this.opponentScore = opponentScore;
    this.myScore = myScore;
    this.seconds = seconds;
    this.date = date;
  }
}
