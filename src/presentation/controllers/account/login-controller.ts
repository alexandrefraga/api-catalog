import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { Authentication } from '@/domain/usecases/account/authentication'
import { EmailValidator, Validation } from '@/presentation/protocolls'
import { success, unauthorized } from '@/presentation/helpers/http-helper'
import { ValidationsBuilder } from '@/presentation/validations'

export type LoginParams = {
  email: string
  password: string
}

export class LoginController extends Controller<LoginParams> {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticator: Authentication
  ) { super() }

  async perform (request: LoginParams): Promise<HttpResponse> {
    const authenticationResponse = await this.authenticator.auth(request)
    if (!authenticationResponse) {
      return unauthorized()
    }
    return success(authenticationResponse)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .stringValidations({
        field: 'password',
        minLength: 6,
        maxLength: 12,
        required: true
      })
      .emailValidation('email', this.emailValidator)
      .build()
  }
}
