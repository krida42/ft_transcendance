import { GameState } from '../type';
import { SCORE_TO_WIN } from '../const';
import { PongGateway } from '../websocket/pong.gateway';
import { PongWorld } from './world';
import { PongBall } from './ball';
import { PongPaddle } from './paddle';

export class GameInit {
  static id: number = 0;
  static pongGateway: PongGateway;

  static initGameState(): GameState {
    const pongWorldInstance = new PongWorld();

    const newGameState: GameState = {
      scoreToWin: SCORE_TO_WIN,
      score1: 0,
      score2: 0,
      pongWorld: pongWorldInstance,
      pongBall: new PongBall(pongWorldInstance),
      pongPaddle1: new PongPaddle(pongWorldInstance, 1),
      pongPaddle2: new PongPaddle(pongWorldInstance, 2),
    };
    pongWorldInstance.setupCollisions(newGameState);
    return newGameState;
  }
}
