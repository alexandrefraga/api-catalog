import { Controller, SignUpRequestParameters, HttpResponse, Validation } from '../../protocolls'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers/http-helper'
import { AddAccount } from '@/domain/usecases/add-account'
import { EmailInUseError } from '../../errors'

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
      const account = await this.addAccount.add({ name, email, password })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      return created('Sent confirmation email!')
    } catch (error) {
      return serverError(error)
    }
  }
}
