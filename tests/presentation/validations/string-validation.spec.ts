import { StringValidation } from '@/presentation/validations/string-validation'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'

describe('String Validation', () => {
  it('Should return a MissingParamError when a required param is not provided', async () => {
    const sut = new StringValidation({
      input: {},
      field: 'field',
      minLength: 4,
      maxLength: 15,
      required: true
    })
    const promise = sut.validate()
    await expect(promise).resolves.toEqual(new MissingParamError('field'))
  })

  describe('Type checking', () => {
    [
      {
        input: { field: 2021 },
        field: 'field',
        minLength: 4,
        maxLength: 15,
        required: true
      },
      {
        input: { field: 2021 },
        field: 'field',
        minLength: 4,
        maxLength: 15,
        required: false
      }
    ].forEach(async params => {
      it('Should returns a InvalidParamError if value is not string', async () => {
        const promise = new StringValidation(params).validate()
        await expect(promise).resolves.toEqual(new InvalidParamError('field'))
      })
    })
  })

  describe('Length checking', () => {
    [
      {
        input: { field: 'short_length' },
        field: 'field',
        minLength: 20,
        maxLength: 40,
        required: true
      },
      {
        input: { field: 'long_length' },
        field: 'field',
        minLength: 4,
        maxLength: 10,
        required: false
      }
    ].forEach(async params => {
      it('Should returns a InvalidParamError to a value from invalid length', async () => {
        const promise = new StringValidation({ ...params }).validate()
        await expect(promise).resolves.toEqual(new InvalidParamError('field'))
      })
    })
  })

  it('Should returns null if validation succeeds', async () => {
    const sut = new StringValidation({
      input: { field: 'any_value' },
      field: 'field',
      minLength: 4,
      maxLength: 15,
      required: true
    })
    const promise = sut.validate()
    await expect(promise).resolves.toBeNull()
  })
})
