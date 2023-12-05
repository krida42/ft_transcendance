import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('pause')
  stopGame() {
    this.gameService.pause();
  }

  @Get('search')
  searchGame() {
    this.gameService.search();
  }
}
