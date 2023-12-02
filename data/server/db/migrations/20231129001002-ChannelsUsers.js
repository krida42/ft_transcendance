'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ChannelsUsers', {
      chanId: {
        primaryKey: true,
        foreignKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Channels',
          key: 'chanId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        primaryKey: true,
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
      userStatus: {
        allowNull: false,
        type: Sequelize.ENUM('Direct', 'Owner', 'Admin', 'User', 'Muted', 'Banned'),
        defaultValue: 'User',
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChannelsUsers');
  },
};
