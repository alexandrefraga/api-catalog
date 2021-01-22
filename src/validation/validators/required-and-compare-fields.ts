import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'

export class RequiredAndCompareFieldsValidation implements Validation {
  constructor (private readonly field: string, private readonly fieldToCompareName: string) {}

  async validate (input: any): Promise<Error> {
    return new Promise((resolve, reject) => {
      let response = null
      if (!input[this.field] || !input[this.fieldToCompareName]) {
        response = new MissingParamError(`${this.field} or ${this.fieldToCompareName}`)
      } else {
        if (input[this.field] !== input[this.fieldToCompareName]) {
          response = new InvalidParamError(this.fieldToCompareName)
        }
      }
      resolve(response)
    })
  }
}
