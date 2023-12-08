'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ChannelsUsers', [
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
        userId: '791deadd-4703-4545-b5c3-cd9969b1a2d9', // lunk
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
