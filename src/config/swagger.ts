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
    tags: [
      { name: 'Classes', description: 'Endpoints relacionados às turmas' },
      { name: 'Teachers', description: 'Endpoints relacionados aos professores' }
    ],
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
        },
        CreateTeacherDTO: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string',
              description: 'Nome completo do professor',
              example: 'João Silva'
            },
            cpf: {
              type: 'string',
              description: 'CPF do professor',
              example: '123.456.789-00'
            },
            registrationNumber: {
              type: 'string',
              description: 'Número de matrícula do professor',
              example: '20230001'
            },
            classes: {
              type: 'array',
              items: {
                type: 'string',
                description: 'ID da turma associada'
              },
              description: 'Lista de IDs das turmas associadas ao professor',
              example: ['1', '2', '3']
            }
          },
          required: ['fullName', 'cpf', 'registrationNumber', 'classes']
        }
      }
    }
  },
  apis: ['./src/controller/*.ts', 'controller/*.js']
};
