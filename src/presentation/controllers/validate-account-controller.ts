import { Controller, HttpResponse, ValidateAccountParams, Validation } from '@/presentation/protocolls'

export class ValidateAccountController implements Controller<ValidateAccountParams> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (data: ValidateAccountParams): Promise<HttpResponse> {
    await this.validator.validate(data.tokenValidation)
    return Promise.resolve(null)
  }
}
