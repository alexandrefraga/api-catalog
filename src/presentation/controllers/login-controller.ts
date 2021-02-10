import { Authentication } from '@/domain/usecases/authentication'
import { Controller, HttpResponse, LoginRequestParameters, Validation } from '@/presentation/protocolls'
import { badRequest, serverError } from '../helpers/http-helper'

export class LoginController implements Controller<LoginRequestParameters> {
  constructor (
    private readonly validator: Validation,
    private readonly authenticator: Authentication
  ) {}

  async execute (data: LoginRequestParameters): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      await this.authenticator.auth(data)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
