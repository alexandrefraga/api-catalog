import { RequiredFields, ValidationsBuilder } from '@/presentation/validations'

describe('ValidationsBuilder', () => {
  it('should ValidationsBuilder returns correct validations', () => {
    const validations = ValidationsBuilder
      .of({ field: 'any_value' })
      .requiredFields(['field1', 'field2'])
      .build()
    expect(validations[0]).toEqual(new RequiredFields({ field: 'any_value' }, ['field1', 'field2']))
  })
})
