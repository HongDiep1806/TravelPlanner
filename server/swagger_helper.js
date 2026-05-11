const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'WeCamp API',
    description: 'WeCamp Travel Planner Pro API documentation for Rainbow Team'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['./server.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);