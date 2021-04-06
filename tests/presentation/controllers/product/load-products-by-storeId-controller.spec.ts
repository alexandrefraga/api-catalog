import { mockLoadProductsByStoreIdUseCase, mockProductModel, mockValidator } from '@/../tests/mocks'
import { ServerError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'
import { LoadProductsByStoreIDController } from '@/presentation/controllers/product/load-products-by-storeId-controller'
import { InvalidParamError } from '@/data/errors'

const request = { storeId: 'valid_storeId' }

type SutTypes = {
  sut: LoadProductsByStoreIDController
  validatorStub: Validation
  loadProductsByStoreIdUseCase
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const loadProductsByStoreIdUseCase = mockLoadProductsByStoreIdUseCase()
  const sut = new LoadProductsByStoreIDController(validatorStub, loadProductsByStoreIdUseCase)
  return {
    sut,
    validatorStub,
    loadProductsByStoreIdUseCase
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

  test('Should call LoadProductsByStoreIdUseCase with correct values', async () => {
    const { sut, loadProductsByStoreIdUseCase } = makeSut()
    const loadByStoreSpy = jest.spyOn(loadProductsByStoreIdUseCase, 'loadByStore')
    await sut.execute(request)
    expect(loadByStoreSpy).toHaveBeenCalledWith(request.storeId)
  })

  test('Should return 403 if LoadProductsByStoreIdUseCase return a specific error', async () => {
    const { sut, loadProductsByStoreIdUseCase } = makeSut()
    jest.spyOn(loadProductsByStoreIdUseCase, 'loadByStore').mockReturnValueOnce(Promise.resolve(new InvalidParamError('storeId')))
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new InvalidParamError('storeId'))
  })

  test('Should return 500 if LoadProductsByStoreIdUseCase throws', async () => {
    const { sut, loadProductsByStoreIdUseCase } = makeSut()
    jest.spyOn(loadProductsByStoreIdUseCase, 'loadByStore').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 200 if LoadProductsByStoreIdUseCase return products', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toEqual(mockProductModel())
  })
})
