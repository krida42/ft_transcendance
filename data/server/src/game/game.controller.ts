import { Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { User } from 'db/models/user';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}


}
