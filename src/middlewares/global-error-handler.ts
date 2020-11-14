import { Request, Response, NextFunction } from 'express'

function globalErrorHandler (err: Error, _: Request, res: Response, __: NextFunction) {
  console.error(err)

  return res.status(500).json({
    message: 'Something wrong'
  })
}

export default globalErrorHandler
