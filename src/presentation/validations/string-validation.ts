import { Validation } from '@/presentation/protocolls'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'

export class StringValidation implements Validation {
  private readonly input: any
  private readonly field: string
  private readonly minLength: number
  private readonly maxLength: number
  private readonly required: boolean
  constructor (data: { input: any, field: string, minLength: number, maxLength: number, required: boolean }) {
    this.input = data.input
    this.field = data.field
    this.minLength = data.minLength
    this.maxLength = data.maxLength
    this.required = data.required
  }

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      let result = null
      if (this.required && this.input[this.field] === undefined) {
        result = new MissingParamError(this.field)
      }
      if (this.input[this.field] !== undefined) {
        if (typeof this.input[this.field] !== 'string') {
          result = new InvalidParamError(this.field)
        } else {
          const size = this.input[this.field].length
          if (size < this.minLength || size > this.maxLength) {
            result = new InvalidParamError(this.field)
          }
        }
      }
      resolve(result)
    })
  }
}
