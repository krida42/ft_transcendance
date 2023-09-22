'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Friends', {
      public_id_user: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
      },
      public_id_friend: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Active', 'Blocked'),
        allowNull: false,
        defaultValue: 'Pending',
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Friends');
  }
};
