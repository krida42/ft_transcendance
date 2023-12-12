import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Games } from '../../db/models/games';
import { User } from 'db/models/user';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Games)
    private gameModel: typeof Games,
  ) {}

}
