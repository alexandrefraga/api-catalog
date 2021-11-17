import { EmailValidation, PhoneNumberArrayValidation, RequiredFieldsAndCompareValues, StringValidation, ValidationsBuilder } from '@/presentation/validations'
import { MockEmailValidator } from '../../mocks'

describe('ValidationsBuilder', () => {
  it('should ValidationsBuilder returns correct validations', () => {
    const validations = ValidationsBuilder
      .of({ field: 'any_value' })
      .stringValidations({
        field: 'field',
        minLength: 2,
        maxLength: 3,
        required: true
      })
      .requiredFieldsAndCompareValues('field', 'fieldCompare')
      .emailValidation('field', MockEmailValidator())
      .phoneNumberArrayValidation('phone', 2)
      .build()
    expect(validations[0]).toEqual(new StringValidation({
      input: { field: 'any_value' },
      field: 'field',
      minLength: 2,
      maxLength: 3,
      required: true
    }))
    expect(validations[1]).toEqual(new RequiredFieldsAndCompareValues({ field: 'any_value' }, 'field', 'fieldCompare'))
    expect(validations[2]).toEqual(new EmailValidation({ field: 'any_value' }, 'field', MockEmailValidator()))
    expect(validations[3]).toEqual(new PhoneNumberArrayValidation({ field: 'any_value' }, 'phone', 2))
  })
})
