import { Validation } from '../protocolls/validation'

export class RequiredFields implements Validation {
  constructor (
    private readonly input: any,
    private readonly fieldName: string[]
  ) {}

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      this.fieldName.forEach(field => {
        if (this.input[field] === undefined) {
          resolve(new Error(`Missing param: ${field}`))
        }
      })
      resolve(null)
    })
  }
}
