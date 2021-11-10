import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { EmailValidator, Validation } from '@/presentation/protocolls'
import { created, forbidden } from '@/presentation/helpers/http-helper'
import { ValidationsBuilder } from '@/presentation/validations'
import { EmailInUseError } from '@/presentation/errors'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { SendMail } from '@/domain/usecases/send-mail-usecase'

type SignUpParams = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export class SignUpController extends Controller<SignUpParams> {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly addAccountSignature: AddSignatureToken,
    private readonly sendMail: SendMail
  ) { super() }

  async perform (request: SignUpParams): Promise<HttpResponse> {
    const account = await this.addAccount.add(request)
    if (!account) {
      return forbidden(new EmailInUseError())
    }
    const { token } = await this.addAccountSignature.add({ id: account.id })
    await this.sendMail.send({
      name: account.name,
      email: account.email,
      token,
      subject: `Account confirmation to ${account.name}`
    })
    return created('Sent confirmation email!')
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .requiredFields(['name'])
      .requiredFieldsAndCompareValues('password', 'passwordConfirmation')
      .emailValidation('email', this.emailValidator)
      .build()
  }
}
