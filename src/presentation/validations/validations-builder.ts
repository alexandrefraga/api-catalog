import { Validation } from '../protocolls/validation'
import { RequiredFields } from './required-fields'
import { EmailValidation, RequiredFieldsAndCompareValues } from '.'
import { EmailValidator } from '../protocolls/emailValidator'

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

  emailValidation (field: string, validator: EmailValidator): ValidationsBuilder {
    this.validations.push(new EmailValidation(this.data, field, validator))
    return this
  }

  build (): Validation[] {
    return this.validations
  }
}
