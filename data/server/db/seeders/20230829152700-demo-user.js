'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      fortyTwo_id: 1,
      email: "vbarbier@gmail.com",
      login: "vbarbier",
      pseudo: "Vincent Barbier",
      image_link: "https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/vbarbier.jpg",
      phone: "0631565656",
    },
  {
    fortyTwo_id: 2,
    email: "sloquet@gmail.com",
    login: "sloquet",
    pseudo: "Sylvain Loquet",
    image_link: "https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/sloquet.jpg",
    phone: "0622222222"
  },
  {
    fortyTwo_id: 3,
    email: "skhali",
    login: "skhali",
    pseudo: "Sofiane Khali",
    image_link: "https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/skhali.jpg",
    phone: "0611111111"
  },],
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};