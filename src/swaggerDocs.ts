import swaggerJsDocs, { ApiInformation } from 'swagger-jsdoc'

const swaggerOptions: swaggerJsDocs.Options = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Test Allugator',
      description: 'API Documentation'
    }
  },
  apis: ['./routes.ts']
}

const swaggerDocs = swaggerJsDocs(swaggerOptions)

export default swaggerDocs
