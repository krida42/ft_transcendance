'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ChannelsUsers', [
      // CHAN 192df5fd-b861-495c-8f62-0657891e4899 BEN
      {
        chanId: '192df5fd-b861-495c-8f62-0657891e4899',
        userId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        userStatus: 'Owner',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      // CHAN e1a21913-9371-4a5d-9513-d486995b468e BEN
      {
        chanId: 'e1a21913-9371-4a5d-9513-d486995b468e',
        userId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        userStatus: 'Owner',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: 'e1a21913-9371-4a5d-9513-d486995b468e',
        userId: 'a8513d5d-7804-4ef3-b08f-2943d197840a', // apple
        userStatus: 'User',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: 'e1a21913-9371-4a5d-9513-d486995b468e',
        userId: '791deadd-4703-4545-b5c3-cd9969b1a2d9', // link
        userStatus: 'User',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      // CHAN f5178ade-a7ed-48a5-95df-365d7c16dcd2 BEN
      {
        chanId: 'f5178ade-a7ed-48a5-95df-365d7c16dcd2',
        userId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        userStatus: 'Owner',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: 'f5178ade-a7ed-48a5-95df-365d7c16dcd2',
        userId: 'c033f771-8759-444e-9fa9-9c8b26719345', // art
        userStatus: 'User',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      // CHAN 7dad5dee-1fca-47d6-abc8-8fb2e9d13b41 BEN OWNER + MARVIN
      {
        chanId: '7dad5dee-1fca-47d6-abc8-8fb2e9d13b41',
        userId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        userStatus: 'Owner',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '7dad5dee-1fca-47d6-abc8-8fb2e9d13b41',
        userId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        userStatus: 'Admin',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      // CHAN 3da72eca-2395-431a-922d-dc8a206fafc4 MARVIN OWNER EMPTY
      {
        chanId: '3da72eca-2395-431a-922d-dc8a206fafc4',
        userId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        userStatus: 'Owner',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      // CHAN 8f0708d2-3984-432f-b019-4152e47349fd MARVIN OWNER + USERS
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        userStatus: 'Owner',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        userStatus: 'Admin',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: 'a8513d5d-7804-4ef3-b08f-2943d197840a', // apple
        userStatus: 'User',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: '791deadd-4703-4545-b5c3-cd9969b1a2d9', // link
        userStatus: 'User',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: '5c0e1ee2-5589-43a6-b0b9-50044a080422', // humma
        userStatus: 'Muted',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: 'ee301078-2e9d-457d-9fd8-c9fbbdf42a12', // ford
        userStatus: 'Muted',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: 'c033f771-8759-444e-9fa9-9c8b26719345', // art
        userStatus: 'Banned',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: 'b5c745e4-a49b-4e8f-979b-61dd287b9f19', // tri
        userStatus: 'Banned',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: '8d4ac36d-251f-4fa2-ab6c-ed3fb06d9f40', // zap
        userStatus: 'Invited',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        userId: '757f4aab-72cb-4360-81b8-7446b0e1de00', // pixel
        userStatus: 'Invited',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ChannelsUsers', null, {});
  },
};
