'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Achievements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Achievements');
  }
};
