import { Injectable } from '@nestjs/common';
import { PongRoom } from './lobby/room';
import { Socket } from 'socket.io';
import { PongGateway } from './websocket/pong.gateway';

@Injectable()
export class GameService {
  start(){
    console.log('Game started id:');
  }

  pause() {
    console.log('Game paused');
  }

  search() {
    console.log('Game searched');
  }
}