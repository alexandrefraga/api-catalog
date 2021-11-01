import { SignatureTypes } from '@/domain/models/signature-token-model'
import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { Controller, HttpResponse, ValidateAccountParams } from '@/presentation/protocolls'
import { badRequest, serverError, unauthorized, success } from '../../helpers/http-helper'
import { Validation } from '@/validation/protocols/validation'

export class ValidateAccountController implements Controller<ValidateAccountParams> {
  constructor (
    private readonly validator: Validation,
    private readonly validateAccount: ValidateAccount
  ) {}

  async execute (data: ValidateAccountParams): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      const validated = await this.validateAccount.validate(data.signature, SignatureTypes.account)
      if (!validated) {
        return unauthorized()
      }
      return success({ msg: 'Confirmated user account!' })
    } catch (error) {
      return serverError(error)
    }
  }
}
