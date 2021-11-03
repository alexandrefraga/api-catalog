import { SignatureTypes } from '@/domain/models/signature-token-model'
import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { HttpResponse, ValidateAccountParams, Validation } from '@/presentation/protocolls'
import { unauthorized, success } from '../../helpers/http-helper'
import { Controller } from '@/presentation/controllers/controller'
import { ValidationsBuilder } from '@/presentation/validations'

export class ValidateAccountController extends Controller {
  constructor (
    private readonly validateAccount: ValidateAccount
  ) { super() }

  async perform (data: ValidateAccountParams): Promise<HttpResponse> {
    const validated = await this.validateAccount.validate(data.signature, SignatureTypes.account)
    if (!validated) {
      return unauthorized()
    }
    return success({ msg: 'Confirmated user account!' })
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest).requiredFields(['signature']).build()
  }
}
