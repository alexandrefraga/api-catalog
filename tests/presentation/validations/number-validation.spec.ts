import { NumberValidation } from '@/presentation/validations'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'

describe('Number Validation', () => {
  it('Should return a MissingParamError when a required param is not provided', async () => {
    const sut = new NumberValidation({
      input: {},
      field: 'field',
      required: true
    })
    const promise = sut.validate()
    await expect(promise).resolves.toEqual(new MissingParamError('field'))
  })

  describe('Type checking', () => {
    [
      {
        input: { field: '2021' },
        field: 'field',
        required: true
      },
      {
        input: { field: '2021' },
        field: 'field',
        required: false
      }
    ].forEach(async params => {
      it('Should return a InvalidParamError when not a number', async () => {
        const promise = new NumberValidation(params).validate()
        await expect(promise).resolves.toEqual(new InvalidParamError('field'))
      })
    })
  })
})
