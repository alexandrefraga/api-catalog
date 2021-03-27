import { Middleware, HttpRequest } from '@/presentation/protocolls'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpRequest = {
      headers: req.headers,
      params: {}
    }

    for (const field of ['storeId']) {
      if (req.params[field]) {
        Object.assign(request.params, { [`${field}`]: req.params[field] })
      }
    }

    const response = await middleware.execute(request)
    if (response.statusCode === 200) {
      Object.assign(req.body, response.body)
      next()
    } else {
      res.status(response.statusCode).json({
        error: response.body.message
      })
    }
  }
}
