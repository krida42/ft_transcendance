'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        confidential_id: 10,
        fortyTwo_id: 420,
        public_id: 'a8513d5d-7804-4ef3-b08f-2943d197840a',
        email: 'apple@gmail.42com',
        login: 'apple',
        pseudo: 'Apple',
        avatar:
          'https://cdn1.vectorstock.com/i/1000x1000/37/55/apple-logo-brand-phone-symbol-with-name-white-vector-46213755.jpg',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 11,
        fortyTwo_id: 421,
        public_id: '90aeb920-0ebd-4361-83a6-01a9a8748f32',
        email: 'ben@gmail.42com',
        login: 'ben',
        pseudo: 'Ben',
        avatar:
          'https://cdn.intra.42.fr/users/255d229719a0e7597fbe394ab1765d78/ben.jpg',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 12,
        fortyTwo_id: 422,
        public_id: '791deadd-4703-4545-b5c3-cd9969b1a2d9',
        email: 'lunk@gmail.42com',
        login: 'lunk',
        pseudo: 'Lunk',
        avatar: 'https://thispersondoesnotexist.com/',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 13,
        fortyTwo_id: 423,
        public_id: '5c0e1ee2-5589-43a6-b0b9-50044a080422',
        email: 'humma@gmail.42com',
        login: 'humma',
        pseudo: 'Humma',
        avatar:
          'https://logos.textgiraffe.com/logos/logo-name/Humma-designstyle-soccer-m.png',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 14,
        fortyTwo_id: 424,
        public_id: 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57',
        email: 'marvin@gmail.42com',
        login: 'marvin',
        pseudo: 'Marvin',
        avatar:
          'https://cdn.intra.42.fr/users/939cb30d6e8db420354f9a51d4af0b90/eamar.jpg',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 15,
        fortyTwo_id: 425,
        public_id: 'ee301078-2e9d-457d-9fd8-c9fbbdf42a12',
        email: 'ford@gmail.42com',
        login: 'ford',
        pseudo: 'Ford',
        avatar:
          'https://cdn4.vectorstock.com/i/1000x1000/18/28/ford-brand-logo-symbol-name-blue-design-car-usa-vector-46021828.jpg',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 16,
        fortyTwo_id: 426,
        public_id: 'c033f771-8759-444e-9fa9-9c8b26719345',
        email: 'art@gmail.42com',
        login: 'art',
        pseudo: 'Art',
        avatar:
          'https://cdn1.vectorstock.com/i/1000x1000/72/80/art-colored-rainbow-word-text-suitable-for-logo-vector-22337280.jpg',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 17,
        fortyTwo_id: 427,
        public_id: 'b5c745e4-a49b-4e8f-979b-61dd287b9f19',
        email: 'tri@gmail.42com',
        login: 'tri',
        pseudo: 'Tri',
        avatar:
          'https://logos.textgiraffe.com/logos/logo-name/Tri-designstyle-jungle-m.png',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 18,
        fortyTwo_id: 428,
        public_id: '8d4ac36d-251f-4fa2-ab6c-ed3fb06d9f40',
        email: 'zap@gmail.42com',
        login: 'zap',
        pseudo: 'Zap',
        avatar:
          'https://www.shutterstock.com/image-vector/zap-comic-speech-bubble-cartoon-260nw-180152516.jpg',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        confidential_id: 19,
        fortyTwo_id: 429,
        public_id: '757f4aab-72cb-4360-81b8-7446b0e1de00',
        email: 'pixel@gmail.42com',
        login: 'pixel',
        pseudo: 'Pixel',
        avatar:
          'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/e8590726623499.5635803c08df8.png',
        phone: '0642424242',
        twoFactorEnable: false,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
