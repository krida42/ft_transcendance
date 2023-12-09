'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Friends', [
      {
        sender_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        receiver_id: '90aeb920-0ebd-4361-83a6-01a9a8748f32', // ben
        status: 'Pending',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        receiver_id: '8d4ac36d-251f-4fa2-ab6c-ed3fb06d9f40', // zap
        status: 'Pending',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: '791deadd-4703-4545-b5c3-cd9969b1a2d9', // sid
        receiver_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        status: 'Pending',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: '53aefe26-1adb-4a6a-8f78-e52ac3dad1f5', // void
        receiver_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        status: 'Pending',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: '757f4aab-72cb-4360-81b8-7446b0e1de00', // pixel
        receiver_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        status: 'Pending',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        receiver_id: '5c0e1ee2-5589-43a6-b0b9-50044a080422', // humma
        status: 'Active',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: 'ee301078-2e9d-457d-9fd8-c9fbbdf42a12', // ford
        receiver_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        status: 'Active',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        receiver_id: 'c033f771-8759-444e-9fa9-9c8b26719345', // art
        status: 'Blocked',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        sender_id: 'b5c745e4-a49b-4e8f-979b-61dd287b9f19', // tri
        receiver_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        status: 'Blocked',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Friends', null, {});
  },
};
