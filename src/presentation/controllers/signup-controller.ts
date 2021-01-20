import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'
import { EmailValidator } from '@/validation/protocols'
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'

export class SignUpController implements Controller<SignUpRequestParameters> {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    try {
      const requiredField = ['name', 'email']
      for (const field of requiredField) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(request.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}