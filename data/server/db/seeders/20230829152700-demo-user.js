'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      fortyTwo_id: 1,
      email: "vvbarbier@gmail.com",
      login: "vvbarbier",
      pseudo: "Vvincent Barbier",
      avatar: "https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/vvbarbier.jpg",
      phone: "0631565656",
    },
  {
    fortyTwo_id: 2,
    email: "ssloquet@gmail.com",
    login: "ssloquet",
    pseudo: "Ssylvain Loquet",
    avatar: "https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/ssloquet.jpg",
    phone: "0622222222"
  },
  {
    fortyTwo_id: 3,
    email: "sskhali",
    login: "sskhali",
    pseudo: "Ssofiane Khali",
    avatar: "https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/sskhali.jpg",
    phone: "0611111111"
  },],
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};