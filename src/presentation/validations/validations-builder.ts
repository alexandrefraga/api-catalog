import { Validation } from './validation'
import { RequiredFields } from './required-fields'
import { RequiredFieldsAndCompareValues } from '.'

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

  requiredFieldsAndCompareValues (field: string, fieldCompare: string): ValidationsBuilder {
    this.validations.push(new RequiredFieldsAndCompareValues(this.data, field, fieldCompare))
    return this
  }

  build (): Validation[] {
    return this.validations
  }
}
