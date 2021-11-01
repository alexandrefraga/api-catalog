import { Controller, SignUpRequestParameters, HttpResponse } from '../../protocolls'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers/http-helper'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { EmailInUseError } from '../../errors'
import { SendMail } from '@/domain/usecases/send-mail-usecase'
import { SignatureTypes } from '@/domain/models/signature-token-model'
import { Validation } from '@/validation/protocols/validation'

export class SignUpController implements Controller<SignUpRequestParameters> {
  constructor (
    private readonly validator: Validation,
    private readonly addAccount: AddAccount,
    private readonly addSignatureToken: AddSignatureToken,
    private readonly sendMail: SendMail
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
      const { token } = await this.addSignatureToken.add(account.id, SignatureTypes.account, 'email validation')
      await this.sendMail.send({
        name: account.name,
        email: account.email,
        token,
        subject: `Account confirmation to ${account.name}`
      })
      return created('Sent confirmation email!')
    } catch (error) {
      return serverError(error)
    }
  }
}
