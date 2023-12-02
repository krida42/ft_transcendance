'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      msgId: {
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      chanId: {
        foreignKey: true,
        unique: false,
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
        foreignKey: true,
        unique: false,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'public_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      content: {
        unique: false,
        allowNull: false,
        type: Sequelize.STRING,
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
     await queryInterface.dropTable('Messages');
  }
};
