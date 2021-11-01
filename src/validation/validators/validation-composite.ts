import { Validation } from '@/validation/protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}
  async validate (input: any): Promise<Error> {
    const promises = []
    for (const validation of this.validations) {
      promises.push(validation.validate(input))
    }
    const response = await Promise.all(promises)
    return response.reduce((ac, e) => ac || e, null)
  }
}
