import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  
  start() {
    console.log('Game started id:');
  }

  pause() {
    console.log('Game paused');
  }

  search() {
    console.log('Game searched');
  }
}