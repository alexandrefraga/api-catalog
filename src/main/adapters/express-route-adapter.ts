import { Controller } from '@/presentation/controllers/controller'
import { Request, Response } from 'express'

export const expressAdaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {}
    for (const field of [
      'name', 'email', 'password', 'passwordConfirmation',
      'company', 'tradingName', 'description', 'address', 'email', 'phoneNumber', 'geoLocalization', 'userId',
      'details', 'trademark', 'reference', 'price'
    ]) {
      if (req.body[field]) {
        Object.assign(request, { [`${field}`]: req.body[field] })
      }
    }
    for (const field of ['signature', 'storeId']) {
      if (req.params[field]) {
        Object.assign(request, { [`${field}`]: req.params[field] })
      }
    }
    const httpResponse = await controller.handle(request)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
