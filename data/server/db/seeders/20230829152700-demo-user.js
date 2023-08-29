'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      public_id: '201bebda-4681-11ee-be56-0242ac120002',
      pseudo: 'JohnDoe',
      password: 'password',
      email: 'johnDoe@gmail.com',
      display_name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  {
    public_id: '201bebda-4681-11ee-be56-0242ac120003',
    pseudo: 'JaneDoe',
    password: 'password2',
    email: 'janeDoe@gmail.com',
    display_name: 'Jane Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};