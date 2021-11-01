import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/validations/validation'

export class RequiredFieldsAndCompareValues implements Validation {
  constructor (
    private readonly input: any,
    private readonly field: string,
    private readonly fieldToCompareName: string
  ) {}

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (!this.input[this.field] || !this.input[this.fieldToCompareName]) {
        response = new MissingParamError(`${this.field} or ${this.fieldToCompareName}`)
      } else {
        if (this.input[this.field] !== this.input[this.fieldToCompareName]) {
          response = new InvalidParamError(this.fieldToCompareName)
        }
      }
      resolve(response)
    })
  }
}
