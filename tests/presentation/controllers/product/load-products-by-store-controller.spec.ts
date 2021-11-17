import { mockLoadProductsByStoreUseCase, mockProductModel } from '@/../tests/mocks'
import { ServerError } from '@/presentation/errors'
import { StringValidation } from '@/presentation/validations'
import { LoadProductsByStoreController } from '@/presentation/controllers/product/load-products-by-store-controller'
import { InvalidParamError } from '@/data/errors'
import { Controller } from '@/presentation/controllers/controller'

const request = { storeId: 'valid_storeId' }

type SutTypes = {
  sut: LoadProductsByStoreController
  loadProductsByStoreUseCase
}
const makeSut = (): SutTypes => {
  const loadProductsByStoreUseCase = mockLoadProductsByStoreUseCase()
  const sut = new LoadProductsByStoreController(loadProductsByStoreUseCase)
  return {
    sut,
    loadProductsByStoreUseCase
  }
}
describe('LoadProductsByStore Controller', () => {
  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const input = { storeId: 'any_storeId' }
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new StringValidation(
      { input, field: 'storeId', minLength: 1, maxLength: 30, required: true }
    ))
  })

  it('Should call LoadProductsByStoreUseCase with correct values', async () => {
    const { sut, loadProductsByStoreUseCase } = makeSut()
    const loadByStoreSpy = jest.spyOn(loadProductsByStoreUseCase, 'loadByStore')
    await sut.handle(request)
    expect(loadByStoreSpy).toHaveBeenCalledWith(request)
  })

  it('Should return 403 if LoadProductsByStoreUseCase return a specific error', async () => {
    const { sut, loadProductsByStoreUseCase } = makeSut()
    jest.spyOn(loadProductsByStoreUseCase, 'loadByStore').mockReturnValueOnce(Promise.resolve(new InvalidParamError('storeId')))
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new InvalidParamError('storeId'))
  })

  it('Should return 500 if LoadProductsByStoreUseCase throws', async () => {
    const { sut, loadProductsByStoreUseCase } = makeSut()
    jest.spyOn(loadProductsByStoreUseCase, 'loadByStore').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  it('Should return 200 if LoadProductsByStoreUseCase return products', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toEqual(mockProductModel())
  })
})
