import { Authentication } from '@/domain/usecases/account/authentication'
import { EmailValidator, HttpResponse, LoginRequestParameters, Validation } from '@/presentation/protocolls'
import { success, unauthorized } from '@/presentation/helpers/http-helper'
import { Controller } from '@/presentation/controllers/controller'
import { ValidationsBuilder } from '@/presentation/validations'

export class LoginController extends Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticator: Authentication
  ) { super() }

  async perform (data: LoginRequestParameters): Promise<HttpResponse> {
    const authenticationResponse = await this.authenticator.auth(data)
    if (!authenticationResponse) {
      return unauthorized()
    }
    return success(authenticationResponse)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .requiredFields(['password'])
      .emailValidation('email', this.emailValidator)
      .build()
  }
}
