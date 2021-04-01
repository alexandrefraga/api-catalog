import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'

export class RequiredArrayFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly minLength: number
  ) {}

  async validate (input: any): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (!input[this.fieldName] || !Array.isArray(input[this.fieldName]) || input[this.fieldName].length < this.minLength) {
        response = new MissingParamError(this.fieldName)
      }
      resolve(response)
    })
  }
}
