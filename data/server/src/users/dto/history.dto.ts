import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class HistoryDto {
  @Expose()
  @IsNotEmpty()
  nameOp: string;

  @Expose()
  @IsNotEmpty()
  scoreOp: number;

  @Expose()
  @IsNotEmpty()
  scoreMe: number;

  @Expose()
  @IsNotEmpty()
  duration: number;

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
    this.nameOp = opponentLogin;
    this.scoreOp = opponentScore;
    this.scoreMe = myScore;
    this.duration = seconds;
    this.date = date;
  }
}
