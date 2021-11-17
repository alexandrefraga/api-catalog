import { Validation } from '../protocolls/validation'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'

export class NumberValidation implements Validation {
  private readonly input: any
  private readonly field: string
  private readonly required: boolean
  constructor (data: { input: any, field: string, required: boolean }) {
    this.input = data.input
    this.field = data.field
    this.required = data.required
  }

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      let result = null
      if (this.required && this.input[this.field] === undefined) {
        result = new MissingParamError(this.field)
      }
      if (this.input[this.field] !== undefined) {
        if (typeof this.input[this.field] !== 'number') {
          result = new InvalidParamError(this.field)
        }
      }
      resolve(result)
    })
  }
}
