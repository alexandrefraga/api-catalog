import { EmailValidation, RequiredFields, RequiredFieldsAndCompareValues, ValidationsBuilder } from '@/presentation/validations'
import { MockEmailValidator } from '../../mocks'

describe('ValidationsBuilder', () => {
  it('should ValidationsBuilder returns correct validations', () => {
    const validations = ValidationsBuilder
      .of({ field: 'any_value' })
      .requiredFields(['field1', 'field2'])
      .requiredFieldsAndCompareValues('field', 'fieldCompare')
      .emailValidation('field', MockEmailValidator())
      .build()
    expect(validations[0]).toEqual(new RequiredFields({ field: 'any_value' }, ['field1', 'field2']))
    expect(validations[1]).toEqual(new RequiredFieldsAndCompareValues({ field: 'any_value' }, 'field', 'fieldCompare'))
    expect(validations[2]).toEqual(new EmailValidation({ field: 'any_value' }, 'field', MockEmailValidator()))
  })
})
