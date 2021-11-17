import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls/validation'

export class RequiredField implements Validation {
  constructor (
    private readonly input: any,
    private readonly field: string
  ) {}

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (!this.input[this.field]) {
        response = new MissingParamError(`${this.field}`)
      }
      resolve(response)
    })
  }
}
