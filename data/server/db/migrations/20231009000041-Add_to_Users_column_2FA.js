'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'twoFactorEnable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('Users', 'twoFactorSecret', {
      type: Sequelize.BLOB('tiny'),
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'twoFactorEnable');
    await queryInterface.removeColumn('Users', 'twoFactorSecret');
  }
};
