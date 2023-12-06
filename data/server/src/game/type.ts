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
  scoreToWin: number; // score to win the game
  score1: number; // score P1
  score2: number; // score P2
  pongWorld: PongWorld;
  pongBall: PongBall;
  pongPaddle1: PongPaddle;
  pongPaddle2: PongPaddle;
};
