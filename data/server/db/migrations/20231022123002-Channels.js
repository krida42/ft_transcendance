'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Channels', {
      chanId: {
        primaryKey: true,
        unique: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      chanName: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      ownerId: {
        unique: false,
        allowNull: false,
        type: Sequelize.UUID,
      },
      chanType: {
        allowNull: false,
        type: Sequelize.ENUM('Direct', 'Public', 'Protected', 'Private'),
        defaultValue: 'Public',
      },
      chanPassword: {
        unique: false,
        allowNull: false,
        type: Sequelize.STRING,
      },
      nbUser: {
        unique: false,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      // chanImage: {
      // unique: false,
      // allowNull: true,
      // type: Sequelize.BLOB,
      // defaultValue: null,
      // },
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Channels');
  },
};
