import { Validation } from '@/validation/protocols/validation'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { mockValidator } from '../../mocks'

type SutTypes = {
  sut: ValidationComposite
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = mockValidator()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}
describe('Validation Composite', () => {
  test('Should return a MissingParamError if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.validate({})
    expect(response).toEqual(new Error('specific error'))
  })

  test('Should throw if Validations trows', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate({})
    await expect(promise).rejects.toThrow()
  })

  test('Should return null If Validations on success', async () => {
    const { sut } = makeSut()
    const response = await sut.validate({})
    expect(response).toBeNull()
  })
})
