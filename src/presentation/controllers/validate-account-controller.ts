import { Controller, HttpResponse, ValidateAccountParams, Validation } from '@/presentation/protocolls'
import { badRequest } from '../helpers/http-helper'

export class ValidateAccountController implements Controller<ValidateAccountParams> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (data: ValidateAccountParams): Promise<HttpResponse> {
    const error = await this.validator.validate(data.tokenValidation)
    if (error) {
      return badRequest(error)
    }
    return null
  }
}
