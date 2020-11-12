import express, { Express } from 'express'
import cors from 'cors'
import swaggerUiExpress from 'swagger-ui-express'

import swaggerDocs from './swaggerDocs'

import routes from './routes'

class App {
  public server: Express

  constructor () {
    this.server = express()
    this.globalMiddlewares()
    this.routes()
  }

  private globalMiddlewares () {
    this.server.use(express.json())
    this.server.use(cors())
    this.server.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs))
  }

  private routes () {
    this.server.use(routes)
  }
}

export default new App()
