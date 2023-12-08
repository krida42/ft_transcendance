'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Channels', [
      {
        chanId: '8f0708d2-3984-432f-b019-4152e47349fd',
        chanName: 'Public mChan',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Public',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '4c2de8f9-4682-413b-a763-687d21d272fe',
        chanName: 'Protected mChan',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Protected',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '3b2b99f6-2d80-46cb-9198-9057c16b38b6',
        chanName: 'Private mChan',
        ownerId: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57', // marvin
        chanType: 'Private',
        chanPassword: 'nannan',
        nbUser: 1,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        chanId: '6743cbee-7aa2-4ea2-a909-9b0181db4651',
        chanName: 'Direct MarvinBen',
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
