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

  stop() {
    console.log('Game stopped');
    this.games[0].stop();
  }

  search() {
    console.log('Game searched');
  }

  updateGames() {
    for (let i = 0; i < this.games.length; i++) {
      this.games[i].update();
    }
  }


  private animationInterval: NodeJS.Timeout;
  }

