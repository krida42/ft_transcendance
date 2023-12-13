'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Channels', [
      // CHAN 192df5fd-b861-495c-8f62-0657891e4899 BEN
      {
        chanId: '192df5fd-b861-495c-8f62-0657891e4899',
        chanName: 'PLANE Ben',
        ownerId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // CHAN e1a21913-9371-4a5d-9513-d486995b468e BEN
      {
        chanId: 'e1a21913-9371-4a5d-9513-d486995b468e',
        chanName: 'POMME Ben',
        ownerId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 3,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // CHAN f5178ade-a7ed-48a5-95df-365d7c16dcd2 BEN
      {
        chanId: 'f5178ade-a7ed-48a5-95df-365d7c16dcd2',
        chanName: 'SHRDLU Ben',
        ownerId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 2,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // CHAN 7dad5dee-1fca-47d6-abc8-8fb2e9d13b41 BEN OWNER + MARVIN
      {
        chanId: '7dad5dee-1fca-47d6-abc8-8fb2e9d13b41',
        chanName: 'Public Ben',
        ownerId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 2,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // CHAN 3da72eca-2395-431a-922d-dc8a206fafc4 MARVIN OWNER EMPTY
      {
        chanId: '3da72eca-2395-431a-922d-dc8a206fafc4',
        chanName: 'Public Marvin',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // CHAN 8f0708d2-3984-432f-b019-4152e47349fd MARVIN OWNER + USERS
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        chanName: 'Generale Marvin',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 7,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '4c2de8f9-4682-413b-a763-687d21d272fe',
        chanName: 'Protected Marvin',
        ownerId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // marvin
        chanType: 'Protected',
        chanPassword: '$2b$10$1Hdk6sz0g0O7ic5BOT.SUuNTzBCGSkKO2oW5p2mLnD80Rxy7t9ITe',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '3b2b99f6-2d80-46cb-9198-9057c16b38b6',
        chanName: 'Private Marvin',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Private',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '6743cbee-7aa2-4ea2-a909-9b0181db4651',
        chanName: 'Direct Marvin-Ben',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Direct',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Channels', null, {});
  },
};
