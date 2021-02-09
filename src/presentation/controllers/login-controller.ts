import { Controller, HttpResponse, LoginRequestParameters, Validation } from '@/presentation/protocolls'
import { badRequest } from '../helpers/http-helper'

export class LoginController implements Controller<LoginRequestParameters> {
  constructor (private readonly validator: Validation) {}

  async execute (data: LoginRequestParameters): Promise<HttpResponse> {
    const error = await this.validator.validate(data)
    if (error) {
      return badRequest(error)
    }
    return null
  }
}
