import { Controller } from '@/presentation/protocolls'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {}
    for (const field of [
      'name', 'email', 'password', 'passwordConfirmation',
      'company', 'tradingName', 'description', 'address', 'email', 'phoneNumber', 'geoLocalization', 'userId'
    ]) {
      if (req.body[field]) {
        Object.assign(request, { [`${field}`]: req.body[field] })
      }
    }
    for (const field of ['tokenValidation']) {
      if (req.params[field]) {
        Object.assign(request, { [`${field}`]: req.params[field] })
      }
    }
    const httpResponse = await controller.execute(request)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
