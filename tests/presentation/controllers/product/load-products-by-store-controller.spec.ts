import { mockLoadProductsByStoreUseCase, mockProductModel, mockValidator } from '@/../tests/mocks'
import { ServerError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols/validation'
import { LoadProductsByStoreController } from '@/presentation/controllers/product/load-products-by-store-controller'
import { InvalidParamError } from '@/data/errors'

const request = { storeId: 'valid_storeId' }

type SutTypes = {
  sut: LoadProductsByStoreController
  validatorStub: Validation
  loadProductsByStoreUseCase
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const loadProductsByStoreUseCase = mockLoadProductsByStoreUseCase()
  const sut = new LoadProductsByStoreController(validatorStub, loadProductsByStoreUseCase)
  return {
    sut,
    validatorStub,
    loadProductsByStoreUseCase
  }
}
describe('LoadProductsByStore Controller', () => {
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

  test('Should call LoadProductsByStoreUseCase with correct values', async () => {
    const { sut, loadProductsByStoreUseCase } = makeSut()
    const loadByStoreSpy = jest.spyOn(loadProductsByStoreUseCase, 'loadByStore')
    await sut.execute(request)
    expect(loadByStoreSpy).toHaveBeenCalledWith(request.storeId)
  })

  test('Should return 403 if LoadProductsByStoreUseCase return a specific error', async () => {
    const { sut, loadProductsByStoreUseCase } = makeSut()
    jest.spyOn(loadProductsByStoreUseCase, 'loadByStore').mockReturnValueOnce(Promise.resolve(new InvalidParamError('storeId')))
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new InvalidParamError('storeId'))
  })

  test('Should return 500 if LoadProductsByStoreUseCase throws', async () => {
    const { sut, loadProductsByStoreUseCase } = makeSut()
    jest.spyOn(loadProductsByStoreUseCase, 'loadByStore').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 200 if LoadProductsByStoreUseCase return products', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toEqual(mockProductModel())
  })
})
