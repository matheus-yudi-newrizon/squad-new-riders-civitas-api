import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Civitas API',
      description: 'Documentação da API do projeto Civitas.',
      version: '1.0.0'
    },
    host: 'localhost:4444',
    tags: [],
    externalDocs: {
      description: 'View swagger.json',
      url: '../swagger.json'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          in: 'header',
          type: 'http',
          scheme: 'bearer'
        }
      },
      schemas: {
        CreateClassDTO: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome da turma',
              example: 'Turma A'
            },
            schoolYear: {
              type: 'string',
              enum: ['1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year'],
              description: 'Ano letivo',
              example: '1st year'
            },
            schoolShift: {
              type: 'string',
              enum: ['Morning', 'Afternoon', 'Night'],
              description: 'Turno da turma',
              example: 'Morning'
            },
            educationType: {
              type: 'string',
              enum: ['Nursery', 'Preschool', 'Elementary school 1'],
              description: 'Tipo de ensino',
              example: 'Preschool'
            }
          },
          required: ['name', 'schoolYear', 'schoolShift', 'educationType']
        }
      }
    }
  },
  apis: ['./src/controller/*.ts', 'controller/*.js']
};
