import express, { Express } from 'express'
import cors from 'cors'

import globalErrorHandler from './middlewares/global-error-handler'

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
    this.server.use(globalErrorHandler)
  }

  private routes () {
    this.server.use(routes)
  }
}

export default new App()
