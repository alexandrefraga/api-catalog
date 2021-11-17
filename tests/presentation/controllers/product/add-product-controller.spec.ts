import { mockAddProductUseCaseParams, mockProductModel } from '@/../tests/mocks/mock-product'
import { mockAddProductUseCase } from '@/../tests/mocks/mock-product-usecase'
import { AddProduct } from '@/domain/usecases/product/add-product'
import { AddProductController } from '@/presentation/controllers/product/add-product-controller'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { StringValidation } from '@/presentation/validations'
import { Controller } from '@/presentation/controllers/controller'

const request = mockAddProductUseCaseParams()

type SutTypes = {
  sut: AddProductController
  addProductUseCaseStub: AddProduct
}
const makeSut = (): SutTypes => {
  const addProductUseCaseStub = mockAddProductUseCase()
  const sut = new AddProductController(addProductUseCaseStub)
  return {
    sut,
    addProductUseCaseStub
  }
}
describe('AddProduct Controller', () => {
  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const input = {
      description: 'any',
      trademark: 'any',
      reference: 'any',
      storeId: 'any'
    }
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new StringValidation(
      { input, field: 'description', minLength: 10, maxLength: 200, required: true }
    ))
    expect(validations).toContainEqual(new StringValidation(
      { input, field: 'trademark', minLength: 3, maxLength: 30, required: true }
    ))
    expect(validations).toContainEqual(new StringValidation(
      { input, field: 'reference', minLength: 1, maxLength: 30, required: true }
    ))
    expect(validations).toContainEqual(new StringValidation(
      { input, field: 'storeId', minLength: 1, maxLength: 30, required: true }
    ))
  })

  it('Should call AddProductUseCase with correct values', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(addProductUseCaseStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith(request)
  })

  it('Should return 403 if AddProductUseCase return an error', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    jest.spyOn(addProductUseCaseStub, 'add').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new Error('specific error'))
  })

  it('Should return 403 if AddProductUseCase return a specific error', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    jest.spyOn(addProductUseCaseStub, 'add').mockReturnValueOnce(Promise.resolve(new InvalidParamError('email')))
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if AddProductUseCase throws', async () => {
    const { sut, addProductUseCaseStub } = makeSut()
    jest.spyOn(addProductUseCaseStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  it('Should return 200 if AddProductUseCase return a product', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(mockProductModel())
  })
})
