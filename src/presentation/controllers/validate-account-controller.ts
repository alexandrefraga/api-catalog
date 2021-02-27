import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Controller, HttpResponse, ValidateAccountParams, Validation } from '@/presentation/protocolls'
import { badRequest, serverError, unauthorized } from '../helpers/http-helper'

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
      const validated = await this.validateAccount.validate(data.tokenValidation)
      if (!validated) {
        return unauthorized()
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
