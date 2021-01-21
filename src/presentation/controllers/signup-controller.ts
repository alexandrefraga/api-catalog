import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Validation } from '../protocolls/validation'

export class SignUpController implements Controller<SignUpRequestParameters> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
    } catch (error) {
      return serverError()
    }
  }
}
