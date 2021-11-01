import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  async validate (input: any): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (!input[this.fieldName]) {
        response = new MissingParamError(this.fieldName)
      }
      resolve(response)
    })
  }
}
