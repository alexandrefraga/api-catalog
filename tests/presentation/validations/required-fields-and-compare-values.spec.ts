import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { RequiredFieldsAndCompareValues } from '@/presentation/validations'

describe('RequiredAndCompareFields Validation', () => {
  test('Should return a MissingParamError if a required field not is provided', async () => {
    const sut = new RequiredFieldsAndCompareValues({}, 'any_field', 'other_field')
    const response = await sut.validate()
    expect(response).toEqual(new MissingParamError('any_field or other_field'))
  })

  test('Should return a InvalidParamError if validation fails', async () => {
    const sut = new RequiredFieldsAndCompareValues(
      { any_field: 'any', other_field: 'other' }, 'any_field', 'other_field'
    )
    const response = await sut.validate()
    expect(response).toEqual(new InvalidParamError('other_field'))
  })

  test('Should returns null if validation succeeds', async () => {
    const sut = new RequiredFieldsAndCompareValues(
      { any_field: 'any', other_field: 'any' }, 'any_field', 'other_field'
    )
    const response = await sut.validate()
    expect(response).toBeNull()
  })
})
