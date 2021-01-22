import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'
import { EmailValidator } from '../protocols'

export class EmailValidation implements Validation {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly field: string
  ) {}

  async validate (input: any): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (!input[this.field]) {
        response = new MissingParamError(this.field)
      } else {
        const isValid = this.emailValidator.isValid(input[this.field])
        if (!isValid) {
          response = new InvalidParamError(this.field)
        }
      }
      resolve(response)
    })
  }
}
