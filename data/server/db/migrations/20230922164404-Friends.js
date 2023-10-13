'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Friends', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      login: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      linkedlogin: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Active', 'Blocked'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Friends');
  }
};