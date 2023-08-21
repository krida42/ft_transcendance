'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      username: Sequelize.STRING,
      isActive: Sequelize.BOOLEAN,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      test: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
};
