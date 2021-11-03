import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'
import { EmailValidator } from '../protocolls/emailValidator'

export class EmailValidation implements Validation {
  constructor (
    private readonly input: any,
    private readonly field: string,
    private readonly emailValidator: EmailValidator
  ) {}

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (!this.input[this.field]) {
        response = new MissingParamError(this.field)
      } else {
        const isValid = this.emailValidator.isValid(this.input[this.field])
        if (!isValid) {
          response = new InvalidParamError(this.field)
        }
      }
      resolve(response)
    })
  }
}
