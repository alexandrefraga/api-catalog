import { RequiredFields } from '@/presentation/validations/required-fields'

describe('Required Fields Validation', () => {
  it('Should return an Error if validation fails', async () => {
    const sut = new RequiredFields({}, ['any_field'])
    const promise = sut.validate()
    await expect(promise).resolves.toEqual(new Error('Missing param: any_field'))
  })

  it('Should returns null if validation succeeds', async () => {
    const sut = new RequiredFields({ field: 'any_value', other: 'any_value' }, ['field', 'other'])
    const promise = sut.validate()
    await expect(promise).resolves.toBeNull()
  })
})
