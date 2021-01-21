import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Validation } from '../protocolls/validation'

export class SignUpController implements Controller<SignUpRequestParameters> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
    } catch (error) {
      return serverError()
    }
  }

  // async handles (httpRequest: HttpRequest): Promise<HttpResponse> {
  //   try {
  //     const error = this.validation.validate(httpRequest.body)
  //     if (error) {
  //       return badRequest(error)
  //     }

  //     const { name, email, password } = httpRequest.body
  //     const account = await this.addAccount.add({
  //       name,
  //       email,
  //       password
  //     })
  //     if (!account) {
  //       return forbidden(new EmailInUseError())
  //     }
  //     const authenticationModel = await this.authenticator.auth({ email, password })
  //     return success(authenticationModel)
  //   } catch (error) {
  //     return serverError(error)
  //   }
  // }
}
