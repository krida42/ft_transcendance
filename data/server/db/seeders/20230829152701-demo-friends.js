'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Friends', [
      {
        login: "k0",
        linkedlogin: "k1",
        status: "Pending",
      },
      {
        login: "k0",
        linkedlogin: "k2",
        status: "Active",
      },
      {
        login: "k2",
        linkedlogin: "k0",
        status: "Active",
      },
      {
        login: "k0",
        linkedlogin: "k3",
        status: "Blocked",
      },
    ],);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Friends', null, {});
  }
};