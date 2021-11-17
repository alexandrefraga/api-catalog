import { Validation } from '../protocolls/validation'

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
        result = new Error(`Missing param: ${this.field}`)
      }
      if (this.input[this.field] !== undefined) {
        if (typeof this.input[this.field] !== 'string') {
          result = new Error(`Requires string type: ${this.field}`)
        } else {
          const size = this.input[this.field].length
          if (size < this.minLength || size > this.maxLength) {
            result = new Error(`Invalid length: ${this.field}`)
          }
        }
      }
      resolve(result)
    })
  }
}
