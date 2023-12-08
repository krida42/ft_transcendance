import { Achievements } from "db/models/achievements";
import { User } from "db/models/user";
import { UserAchievements } from "db/models/userAchievements";
import fs from 'fs';

export class Achievement {
  
  static createAchievementsFromJSON(filePath: string): void {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const achievements = JSON.parse(data) as Achievements[];
  
      achievements.forEach(async (achievement) => {
        const existingAchievement = await Achievements.findOne({ where: { id: achievement.id } });
        if (!existingAchievement) {
          await Achievements.create({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
          });
        }
      });
  
      console.log('Achievements created:', achievements);
    } catch (err) {
      console.log(err);
    }
  }

  static async checkUnlock(user: User, achievement: Achievements): Promise<boolean> 
  {
    try
    {
      const userAchievements = await UserAchievements.findOne({ where: { public_id: user.public_id, achievement_id: achievement.id } });
      if (userAchievements) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static async unlock(user: User, achievement: Achievements): Promise<boolean>
  {
    try
    {
      if (await this.checkUnlock(user, achievement)) {
        console.log('Achievement already unlocked for user:', user.public_id);
        return true;
      }
      await UserAchievements.create({
        public_id: user.public_id,
        achievement_id: achievement.id,
      });
      console.log('Achievement saved for user:', user.public_id);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

}