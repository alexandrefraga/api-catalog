import { EmailValidation, NumberValidation, PhoneNumberArrayValidation, RequiredField, RequiredFieldsAndCompareValues, StringValidation, ValidationsBuilder } from '@/presentation/validations'
import { MockEmailValidator } from '../../mocks'

describe('ValidationsBuilder', () => {
  it('should ValidationsBuilder returns correct validations', () => {
    const input = { field: 'any_value', price: 1 }
    const validations = ValidationsBuilder
      .of(input)
      .stringValidations({
        field: 'field',
        minLength: 2,
        maxLength: 3,
        required: true
      })
      .numberValidations({ field: 'price', required: true })
      .requiredField('field')
      .requiredFieldsAndCompareValues('field', 'fieldCompare')
      .emailValidation('field', MockEmailValidator())
      .phoneNumberArrayValidation('phone', 2)
      .build()
    expect(validations[0]).toEqual(new StringValidation({
      input,
      field: 'field',
      minLength: 2,
      maxLength: 3,
      required: true
    }))
    expect(validations[1]).toEqual(new NumberValidation({
      input,
      field: 'price',
      required: true
    }))
    expect(validations[2]).toEqual(new RequiredField(input, 'field'))
    expect(validations[3]).toEqual(new RequiredFieldsAndCompareValues(input, 'field', 'fieldCompare'))
    expect(validations[4]).toEqual(new EmailValidation(input, 'field', MockEmailValidator()))
    expect(validations[5]).toEqual(new PhoneNumberArrayValidation(input, 'phone', 2))
  })
})
