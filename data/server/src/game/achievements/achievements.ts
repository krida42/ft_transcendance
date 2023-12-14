import { Achievements } from 'db/models/achievements';
import { Friends } from 'db/models/friends';
import { Games } from 'db/models/games';
import { User } from 'db/models/user';
import { UserAchievements } from 'db/models/userAchievements';
import { Op, Sequelize } from 'sequelize';
import { UsersService } from 'src/users/users.service';

export class Achievement {
  tabCheckAchievements: ((user: User) => void)[] = [];
  // friendsService: FriendsService = new FriendsService(Friends, new UsersService(User));

  constructor() {
    this.tabCheckAchievements.push(this.checkFirstGame);
    this.tabCheckAchievements.push(this.checkFirstWin);
    this.tabCheckAchievements.push(this.checkFirstLose);
    this.tabCheckAchievements.push(this.checkFirstDraw);
    this.tabCheckAchievements.push(this.checkBarryAllen);
    this.tabCheckAchievements.push(this.checkOlderThanInternet);
    this.tabCheckAchievements.push(this.checkWinner);
    this.tabCheckAchievements.push(this.checkLoser);
  }

  async isUnlock(user: User, achievement: Achievements): Promise<boolean> {
    try {
      const userAchievements = await UserAchievements.findOne({
        where: { public_id: user.public_id, achievement_id: achievement.id },
      });
      if (userAchievements) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async unlock(user: User, achievement: Achievements): Promise<boolean> {
    try {
      if (await this.isUnlock(user, achievement)) {
        // console.log('Achievement already unlocked for user:', user.public_id, 'achievement:', achievement.name);
        return true;
      }
      await UserAchievements.create({
        public_id: user.public_id,
        achievement_id: achievement.id,
      });
      // console.log('Achievement saved for user:', user.public_id, 'achievement:', achievement.name);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async checkAchievements(user: User): Promise<void> {
    try {
      for (const checkAchievement of this.tabCheckAchievements) {
        await checkAchievement.call(this, user);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkFirstAchievement(
    user: User,
    condition: any,
    condition2: any,
    achievementName: string,
  ): Promise<void> {
    try {
      const gamesPlayed = await Games.count({ where: condition });
      const gamesPlayed2 = await Games.count({ where: condition2 });
      if (gamesPlayed === 1 || gamesPlayed2 === 1) {
        const firstAchievement = await Achievements.findOne({
          where: { name: achievementName },
        });
        if (firstAchievement) {
          await this.unlock(user, firstAchievement);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkFirstGame(user: User): Promise<void> {
    const condition = { player1_id: user.public_id };
    const condition2 = { player2_id: user.public_id };
    const achievementName = 'First_game';
    await this.checkFirstAchievement(
      user,
      condition,
      condition2,
      achievementName,
    );
  }

  async checkFirstLose(user: User): Promise<void> {
    const condition = {
      player1_id: user.public_id,
      score1: { [Op.lt]: Sequelize.literal('score2') },
    };
    const condition2 = {
      player2_id: user.public_id,
      score2: { [Op.lt]: Sequelize.literal('score1') },
    };
    const achievementName = 'First_lose';
    await this.checkFirstAchievement(
      user,
      condition,
      condition2,
      achievementName,
    );
  }

  async checkFirstWin(user: User): Promise<void> {
    const condition = {
      player1_id: user.public_id,
      score1: { [Op.gt]: Sequelize.literal('score2') },
    };
    const condition2 = {
      player2_id: user.public_id,
      score2: { [Op.gt]: Sequelize.literal('score1') },
    };
    const achievementName = 'First_win';
    await this.checkFirstAchievement(
      user,
      condition,
      condition2,
      achievementName,
    );
  }

  async checkFirstDraw(user: User): Promise<void> {
    const condition = {
      player1_id: user.public_id,
      score1: { [Op.eq]: Sequelize.literal('score2') },
    };
    const condition2 = {
      player2_id: user.public_id,
      score2: { [Op.eq]: Sequelize.literal('score1') },
    };
    const achievementName = 'First_draw';
    await this.checkFirstAchievement(
      user,
      condition,
      condition2,
      achievementName,
    );
  }

  async checkBarryAllen(user: User): Promise<void> {
    try {
      const gamesPlayed = await Games.count({
        where: {
          [Op.or]: [
            { player1_id: user.public_id },
            { player2_id: user.public_id },
          ],
          time: { [Op.lt]: 60 },
        },
      });
      if (gamesPlayed === 1) {
        const achievement = await Achievements.findOne({
          where: { name: 'Barry_Allen' },
        });
        if (achievement) {
          await this.unlock(user, achievement);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkOlderThanInternet(user: User): Promise<void> {
    try {
      const gamesPlayed = await Games.count({
        where: {
          [Op.or]: [
            { player1_id: user.public_id },
            { player2_id: user.public_id },
          ],
          time: { [Op.gt]: 270 },
        },
      });
      if (gamesPlayed === 1) {
        const achievement = await Achievements.findOne({
          where: { name: 'Older_than_Internet' },
        });
        if (achievement) {
          await this.unlock(user, achievement);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkWinner(user: User): Promise<void> {
    try {
      const games = await Games.findAll({
        where: {
          [Op.or]: [
            { player1_id: user.public_id },
            { player2_id: user.public_id },
          ],
        },
        order: [['createdAt', 'DESC']], // Trie les jeux par ordre décroissant de création
        limit: 5, // Récupère les 5 derniers jeux
      });

      let consecutiveWins = 0;
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const isUserPlayer1 = game.player1_id === user.public_id;
        const isUserLoser =
          (isUserPlayer1 && game.score1 > game.score2) ||
          (!isUserPlayer1 && game.score2 > game.score1);
        if (isUserLoser) {
          consecutiveWins++;
        } else {
          break;
        }
      }

      if (consecutiveWins === 5) {
        const achievement = await Achievements.findOne({
          where: { name: 'WINNER' },
        });
        if (achievement) {
          await this.unlock(user, achievement);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkLoser(user: User): Promise<void> {
    try {
      const games = await Games.findAll({
        where: {
          [Op.or]: [
            { player1_id: user.public_id },
            { player2_id: user.public_id },
          ],
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
      });

      let consecutiveLosses = 0;
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const isUserPlayer1 = game.player1_id === user.public_id;
        const isUserLoser =
          (isUserPlayer1 && game.score1 < game.score2) ||
          (!isUserPlayer1 && game.score2 < game.score1);
        if (isUserLoser) {
          consecutiveLosses++;
        } else {
          break;
        }
      }

      if (consecutiveLosses === 5) {
        const achievement = await Achievements.findOne({
          where: { name: 'LOSERRRRRRRRRR' },
        });
        if (achievement) {
          await this.unlock(user, achievement);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async checkManHunter(user1: User | null, user2: User | null): Promise<void> {
  //   if (!user1 || !user2) return;
  //   if (await this.friendsService.isFriendship(user1.public_id, user2.public_id)) {
  //     const achievement = await Achievements.findOne({ where: { name: 'Manhunter' } });
  //     if (achievement) {
  //       await this.unlock(user1, achievement);
  //       await this.unlock(user2, achievement);
  //     }
  //   }
  // }
}
