const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API',
      version: '1.0.0',
    },
  },
  apis: ['./src/*/controller.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
