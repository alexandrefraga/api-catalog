import { SignUpRequestParameters, HttpResponse, EmailValidator } from '../../protocolls'
import { created, forbidden } from '@/presentation/helpers/http-helper'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { EmailInUseError } from '../../errors'
import { SendMail } from '@/domain/usecases/send-mail-usecase'
import { SignatureTypes } from '@/domain/models/signature-token-model'
import { Validation } from '@/presentation/protocolls/validation'
import { Controller } from '@/presentation/controllers/controller'
import { ValidationsBuilder } from '@/presentation/validations'

export class SignUpController extends Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly addSignatureToken: AddSignatureToken,
    private readonly sendMail: SendMail
  ) { super() }

  async perform (httpRequest: SignUpRequestParameters): Promise<HttpResponse> {
    const { name, email, password } = httpRequest
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
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .requiredFields(['name'])
      .requiredFieldsAndCompareValues('password', 'passwordConfirmation')
      .emailValidation('email', this.emailValidator)
      .build()
  }
}
