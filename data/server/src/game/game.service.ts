import { Injectable } from '@nestjs/common';
import { PongGateway } from './websocket/pong.gateway';
import { Game } from './instance/game';

@Injectable()
export class GameService {
  private games = new Array<Game>();

  constructor(private pongGateway: PongGateway) {
  }

  addNewGame() {
    this.games.push(new Game(this.pongGateway));
  }

  start() {
    console.log('Game started');
    this.addNewGame();
    this.games[0].start();
  }

  pause() {
    console.log('Game paused');
    this.games[0].pause();
  }

  search() {
    console.log('Game searched');
  }

}

