import { MissingParamError } from '@/presentation/errors'
import { RequiredField } from '@/presentation/validations'

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if a required field not is provided', async () => {
    const sut = new RequiredField({}, 'any_field')
    const response = await sut.validate()
    expect(response).toEqual(new MissingParamError('any_field'))
  })

  it('Should returns null if validation succeeds', async () => {
    const sut = new RequiredField({ any_field: 'any' }, 'any_field')
    const response = await sut.validate()
    expect(response).toBeNull()
  })
})
