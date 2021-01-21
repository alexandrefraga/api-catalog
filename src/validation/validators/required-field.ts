import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  async validate (input: any): Promise<Error> {
    return new Promise(resolve => {
      const error = !input[this.fieldName] ? new MissingParamError(this.fieldName) : null
      resolve(error)
    })
  }
}
