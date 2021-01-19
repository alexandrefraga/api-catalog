import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'

export class SignUpController implements Controller<SignUpRequestParameters> {
  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    const requiredField = ['name', 'email']
    for (const field of requiredField) {
      if (!request[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
