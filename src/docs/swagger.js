import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API AutoStore",
    version: "1.0.0",
    description: "API do backend AutoStore – MVP estruturado"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/routes/*.js"
  ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;