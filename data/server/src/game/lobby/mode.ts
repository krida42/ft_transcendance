import { Game } from "../instance/game";

export abstract class Mode {
	game: Game;
	
  constructor(game: Game) {
	  this.game = game;
 	}

	// Ajoutez d'autres méthodes nécessaires ici
  }