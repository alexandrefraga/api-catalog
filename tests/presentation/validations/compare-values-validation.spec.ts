import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { RequiredFieldsAndCompareValues } from '@/presentation/validations'

describe('RequiredAndCompareFields Validation', () => {
  it('Should return a MissingParamError if a required field not is provided', async () => {
    const sut = new RequiredFieldsAndCompareValues({}, 'any_field', 'other_field')
    const response = await sut.validate()
    expect(response).toEqual(new MissingParamError('any_field or other_field'))
  })

  it('Should return a InvalidParamError if validation fails', async () => {
    const sut = new RequiredFieldsAndCompareValues(
      { any_field: 'any', other_field: 'other' }, 'any_field', 'other_field'
    )
    const response = await sut.validate()
    expect(response).toEqual(new InvalidParamError('other_field'))
  })

  it('Should returns null if validation succeeds', async () => {
    const sut = new RequiredFieldsAndCompareValues(
      { any_field: 'any', other_field: 'any' }, 'any_field', 'other_field'
    )
    const response = await sut.validate()
    expect(response).toBeNull()
  })
})
