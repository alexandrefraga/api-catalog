import { RequiredFieldValidation } from '@/validation/validators/required-field'
import { MissingParamError } from '@/presentation/errors'

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', async () => {
    const sut = new RequiredFieldValidation('any_field')
    const response = await sut.validate({})
    expect(response).toEqual(new MissingParamError('any_field'))
  })

  test('Should returns null if validation succeeds', async () => {
    const sut = new RequiredFieldValidation('field')
    const response = await sut.validate({ field: 'any_value' })
    expect(response).toBeNull()
  })
})
