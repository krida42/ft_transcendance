import { Games } from "../../../db/models/games";
import { GameSave } from "../type";

export class GameDBManager {
  private static gameModel = Games;
  
  static async saveGame(saveGame: GameSave) {
    try {
      await this.gameModel.create({
        player1_id: saveGame.player1_id,
        player2_id: saveGame.player2_id,
        score1: saveGame.score1,
        score2: saveGame.score2,
        time: Math.floor(saveGame.time),
      });
      console.log('Game saved:', saveGame);
    } catch (err) {
      console.log(err);
    }
  }
}