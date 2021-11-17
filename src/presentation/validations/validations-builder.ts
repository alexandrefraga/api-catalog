import { Validation } from '../protocolls/validation'
import { StringValidation } from './string-validation'
import { EmailValidation } from './email-validation'
import { RequiredField } from './required-field-validation'
import { RequiredFieldsAndCompareValues } from './compare-values-validation'
import { EmailValidator } from '../protocolls/emailValidator'
import { PhoneNumberArrayValidation } from './phone-number-validation'
import { NumberValidation } from '.'

export class ValidationsBuilder {
  private readonly validations: any[] = []
  private constructor (
    private readonly data: any
  ) {}

  static of (data: any): ValidationsBuilder {
    return new ValidationsBuilder(data)
  }

  stringValidations (params: {field: string, minLength: number, maxLength: number, required: boolean}): ValidationsBuilder {
    this.validations.push(new StringValidation({ input: this.data, ...params }))
    return this
  }

  numberValidations (params: {field: string, required: boolean}): ValidationsBuilder {
    this.validations.push(new NumberValidation({ input: this.data, ...params }))
    return this
  }

  requiredField (field: string): ValidationsBuilder {
    this.validations.push(new RequiredField(this.data, field))
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

  phoneNumberArrayValidation (field: string, minLength: number): ValidationsBuilder {
    this.validations.push(new PhoneNumberArrayValidation(this.data, field, minLength))
    return this
  }

  build (): Validation[] {
    return this.validations
  }
}
