import { mockValidator } from '@/../tests/mocks'
import { ServerError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'
import { LoadProductsByStoreIDController } from '@/presentation/controllers/product/load-products-by-storeId-controller'

const request = { storeId: 'storeId' }

type SutTypes = {
  sut: LoadProductsByStoreIDController
  validatorStub: Validation
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const sut = new LoadProductsByStoreIDController(validatorStub)
  return {
    sut,
    validatorStub
  }
}
describe('LoadProductsByStoreID Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })
})
