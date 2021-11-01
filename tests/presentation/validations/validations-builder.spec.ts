import { RequiredFields, RequiredFieldsAndCompareValues, ValidationsBuilder } from '@/presentation/validations'

describe('ValidationsBuilder', () => {
  it('should ValidationsBuilder returns correct validations', () => {
    const validations = ValidationsBuilder
      .of({ field: 'any_value' })
      .requiredFields(['field1', 'field2'])
      .requiredFieldsAndCompareValues('field', 'fieldCompare')
      .build()
    expect(validations[0]).toEqual(new RequiredFields({ field: 'any_value' }, ['field1', 'field2']))
    expect(validations[1]).toEqual(new RequiredFieldsAndCompareValues({ field: 'any_value' }, 'field', 'fieldCompare'))
  })
})
