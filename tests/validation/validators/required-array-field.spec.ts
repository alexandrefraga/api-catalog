import { MissingParamError } from '@/presentation/errors'
import { RequiredArrayFieldValidation } from '@/validation/validators/required-array-field'

describe('Required Array Field Validation', () => {
  test('Should return a MissingParamError if the field no is provided', async () => {
    const sut = new RequiredArrayFieldValidation('field', 1)
    const response = await sut.validate({})
    expect(response).toEqual(new MissingParamError('field'))
  })

  test('Should return a MissingParamError if the field not is an array', async () => {
    const sut = new RequiredArrayFieldValidation('field', 1)
    const response = await sut.validate({ field: 'any' })
    expect(response).toEqual(new MissingParamError('field'))
  })

  test('Should return a MissingParamError if the field is an empty array', async () => {
    const sut = new RequiredArrayFieldValidation('field', 1)
    const response = await sut.validate({ field: [] })
    expect(response).toEqual(new MissingParamError('field'))
  })

  test('Should returns null if validation succeeds', async () => {
    const sut = new RequiredArrayFieldValidation('field', 1)
    const response = await sut.validate({ field: ['any_value'] })
    expect(response).toBeNull()
  })
})
