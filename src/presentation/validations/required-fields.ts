import { Validation } from './validation'

export class RequiredFields implements Validation {
  constructor (
    private readonly input: any,
    private readonly fieldName: string[]
  ) {}

  async validate (): Promise<Error | undefined> {
    return new Promise(resolve => {
      this.fieldName.forEach(field => {
        if (this.input[field] === undefined) {
          resolve(new Error(`Missing parameter: ${field}`))
        }
      })
      resolve(null)
    })
  }
}
