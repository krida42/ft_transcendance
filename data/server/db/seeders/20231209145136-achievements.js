'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Achievements', [
      {
        name: 'First game',
        description: 'Litterally you are a Pong player',
        icon: "./assets/achievements/firstGame.png",
      },
      {
        name: 'First lose',
        description: 'You lost your first game... You are a loser',
        icon: "./assets/achievements/firstLose.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'First win',
        description: 'You won your first game!',
        icon: "./assets/achievements/firstWin.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'First draw',
        description: 'Chechmate! This is a draw',
        icon: "./assets/achievements/firstDraw.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'Barry Allen',
        description: 'Faster than light, play a game in less than 1 minutes',
        icon: "./assets/achievements/barryAllen.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'WINNER',
        description: 'Win five games in a row',
        icon: "./assets/achievements/winner.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'LOSERRRRRRRRRR',
        description: 'Lose five games in a row, you are a loser',
        icon: "./assets/achievements/loser.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'Older than internet',
        description: 'No much time in a game',
        icon: "./assets/achievements/olderThanInternet.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        name: 'Man Hunter',
        description: 'Play with a friend',
        icon: "./assets/achievements/manHunt.png",
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Achievements', null, {});
  }
};
