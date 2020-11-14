import express, { Express } from 'express'
import cors from 'cors'

import routes from './routes'
import globalErrorHandler from './middlewares/global-error-handler'

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
    this.server.use(globalErrorHandler)
  }

  private routes () {
    this.server.use(routes)
  }
}

export default new App()
