import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'
import { badRequest, serverError, success } from '@/presentation/helpers/http-helper'
import { Validation } from '../protocolls/validation'
import { AddAccount } from '@/domain/usecases/add-account'

export class SignUpController implements Controller<SignUpRequestParameters> {
  constructor (
    private readonly validator: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const account = this.addAccount.add({ name, email, password })
      return success(account)
    } catch (error) {
      return serverError()
    }
  }
}
