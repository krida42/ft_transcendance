import { Socket } from 'socket.io';
import { PongBall } from './instance/ball';
import { PongWorld } from './instance/world';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { PongPaddle } from './instance/paddle';

export type Player = {
  user: ResponseUserDto;
  client: Socket;
  disconnected?: boolean;
  status?: number;
  number?: number;
  score?: number;
};

export type GameState = {
  scoreToWin: number;
  score: [number, number];
  pongWorld: PongWorld;
  pongBall: PongBall;
  pongPaddle1: PongPaddle;
  pongPaddle2: PongPaddle;
  timeAtEnd: number;
};

export type GameSave = {
  player1_id: string;
  player2_id: string;
  score1: number;
  score2: number;
  time: number;
};