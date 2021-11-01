import { Validation } from './validation'
import { RequiredFields } from './required-fields'

export class ValidationsBuilder {
  private readonly validations: any[] = []
  private constructor (
    private readonly data: any
  ) {}

  static of (data: any): ValidationsBuilder {
    return new ValidationsBuilder(data)
  }

  requiredFields (fields: string[]): ValidationsBuilder {
    this.validations.push(new RequiredFields(this.data, fields))
    return this
  }

  build (): Validation[] {
    return this.validations
  }
}
