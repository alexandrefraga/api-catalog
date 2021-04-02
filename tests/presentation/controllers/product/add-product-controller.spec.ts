import { mockValidator } from '@/../tests/mocks'
import { mockAddProductParams, mockProductModel } from '@/../tests/mocks/mock-product'
import { mockAddProductUseCase } from '@/../tests/mocks/mock-product-usecase'
import { AddProduct } from '@/domain/usecases/product/add-product'
import { AddProductController } from '@/presentation/controllers/product/add-product-controller'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'

const request = mockAddProductParams()

type SutTypes = {
  sut: AddProductController
  validatorStub: Validation
  addProductUseCaseStub: AddProduct
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const addProductUseCaseStub = mockAddProductUseCase()
  const sut = new AddProductController(validatorStub, addProductUseCaseStub)
  return {
    sut,
    validatorStub,
    addProductUseCaseStub
  }
}
describe('AddProduct Controller', () => {
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

  test('Should call AddProductUseCase with correct values', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(addProductUseCaseStub, 'add')
    await sut.execute(request)
    expect(addSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 403 if AddProductUseCase return an error', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    jest.spyOn(addProductUseCaseStub, 'add').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 403 if AddProductUseCase return a specific error', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    jest.spyOn(addProductUseCaseStub, 'add').mockReturnValueOnce(Promise.resolve(new InvalidParamError('email')))
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if AddProductUseCase throws', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    jest.spyOn(addProductUseCaseStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 200 if AddProductUseCase return a product', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(request)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(mockProductModel())
  })
})
