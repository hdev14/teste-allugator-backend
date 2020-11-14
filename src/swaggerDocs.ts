import { resolve } from 'path'
import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Teste Allugator API',
      description: 'API RESTful para consulta de dados de funcionários',
      servers: ['http://localhost:4444']
    }
  },
  apis: [resolve(__dirname, 'routes.ts')]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
export default swaggerDocs
