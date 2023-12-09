import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Games } from '../../db/models/games';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Games)
    private gameModel: typeof Games,
  ) {}

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
