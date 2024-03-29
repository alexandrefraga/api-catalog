import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { Validation } from '@/presentation/protocolls'
import { unauthorized, success } from '../../helpers/http-helper'
import { ValidationsBuilder } from '@/presentation/validations'

export class ValidateAccountController extends Controller<{ signature: string }> {
  constructor (
    private readonly validateAccount: ValidateAccount
  ) { super() }

  async perform (request: { signature: string }): Promise<HttpResponse> {
    const validated = await this.validateAccount.validate(request)
    if (!validated) {
      return unauthorized()
    }
    return success({ msg: 'Confirmated user account!' })
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest).stringValidations({
      field: 'signature',
      minLength: 20,
      maxLength: 600,
      required: true
    }).build()
  }
}
