'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Channels', [
      {
        name: "ch1-pub",
        owner: "test",
        channelType: "Public",
        password: ""
      },
      {
        name: "ch2-pro",
        owner: "test",
        channelType: "Protected",
        password: "pass"
      },
      {
        name: "ch3-pri",
        owner: "test",
        channelType: "Private",
        password: ""
      },
    ],);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Channels', null, {});
  }
};