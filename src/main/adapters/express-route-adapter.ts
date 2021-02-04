import { Controller, SignUpRequestParameters } from '@/presentation/protocolls'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: SignUpRequestParameters = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    }
    const httpResponse = await controller.execute(request)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
