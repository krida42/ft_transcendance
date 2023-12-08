'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Game', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER,
      },
      player1_id: {
        foreignKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'public_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      player2_id: {
        foreignKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'public_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score1: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER,
      },
      score2: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER,
      },
      time: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Game');
  }
};
