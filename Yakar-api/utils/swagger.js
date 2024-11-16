const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API YAKAR',
      version: '1.0.0',
      description: 'Documentation de l\'API pour le projet YAKAR',
      contact: {
        name: 'Support YAKAR',
        email: 'support@yakar.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur local'
      }
    ]
  },
  apis: ['./routes/*.js'], // Indique où Swagger doit chercher les annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
