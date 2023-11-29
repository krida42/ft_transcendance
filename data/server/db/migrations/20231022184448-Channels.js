'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Channels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      channelType: {
        type: Sequelize.ENUM('Direct', 'Public', 'Protected', 'Private'),
        allowNull: false,
        defaultValue: 'Public',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      imageData: {
        type: Sequelize.BUFFER,
        allowNull: true,
        defaultValue: null,
        unique: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Channels');
  }
};