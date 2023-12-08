import { Achievements } from "db/models/achievements";
import { User } from "db/models/user";
import { UserAchievements } from "db/models/userAchievements";
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

  static async saveAchievement(public_id: string, achievement: Achievements) {
    try {
      const user = await User.findOne({ where: { public_id } });
      const achievements = await Achievements.findOne({ where: { id: achievement.id } });
  
      if (user && achievement) {
        await UserAchievements.create({
          public_id: user.public_id,
          achievement_id: achievement.id,
        });
        console.log('Achievement saved for user:', user.public_id);
      } else {
        console.log('User or achievement not found.');
      }
    } catch (err) {
      console.log(err);
    }
  }
}