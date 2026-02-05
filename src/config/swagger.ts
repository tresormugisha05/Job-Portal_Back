import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API',
      version: '1.0.0',
      description: 'A comprehensive job portal API for connecting job seekers with employers',
      contact: {
        name: 'API Support',
        email: 'support@jobportal.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://job-portal-back-fdlt.onrender.com/api-docs',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Jobs',
        description: 'Job posting and search operations',
      },
      {
        name: 'Applications',
        description: 'Job application management',
      },
      {
        name: 'Employers',
        description: 'Employer profile management',
      },
    ],
  },
  apis: ['./src/controllers/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
