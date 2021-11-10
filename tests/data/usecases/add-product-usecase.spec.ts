import { AddProductUseCase } from '@/data/usecases/product/add-product-usecase'
import { LoadStoreByIdRepository, LoadProductByDataRepository, AddProductRepository } from '@/data/protocols/db'
import { DataInUseError, InvalidParamError } from '@/data/errors'

import {
  mockLoadStoreByIdRepository,
  mockAddProductRepository,
  mockLoadProductByDataRepository,
  mockAddProductUseCaseParams,
  mockProductModel
} from '../../mocks/'

const params = mockAddProductUseCaseParams()

type SutTypes = {
  sut: AddProductUseCase
  loadStoreByIdRepositoryStub: LoadStoreByIdRepository
  loadProductByDataRepositoryStub: LoadProductByDataRepository
  addProductRepositoryStub: AddProductRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByIdRepositoryStub = mockLoadStoreByIdRepository(true)
  const loadProductByDataRepositoryStub = mockLoadProductByDataRepository(false)
  const addProductRepositoryStub = mockAddProductRepository()
  const sut = new AddProductUseCase(loadStoreByIdRepositoryStub, loadProductByDataRepositoryStub, addProductRepositoryStub)
  return {
    sut,
    loadStoreByIdRepositoryStub,
    loadProductByDataRepositoryStub,
    addProductRepositoryStub
  }
}
describe('AddProduct Usecase', () => {
  it('Should call LoadStoreByIdRepository with correct value', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadStoreByIdRepositoryStub, 'loadById')
    await sut.add(params)
    expect(loadByIdSpy).toHaveBeenCalledWith(params.storeId)
  })

  it('Should return an error if LoadStoreByIdRepository return null', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(params)
    expect(response).toEqual(new InvalidParamError('storeId'))
  })

  it('Should AddProductUseCase throw if LoadStoreByIdRepository throws', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadProductByDataRepository with correct value', async () => {
    const { sut, loadProductByDataRepositoryStub } = makeSut()
    const loadByDataSpy = jest.spyOn(loadProductByDataRepositoryStub, 'loadByData')
    await sut.add(params)
    expect(loadByDataSpy).toHaveBeenCalledWith({
      trademark: params.trademark,
      reference: params.reference,
      storeId: params.storeId
    })
  })

  it('Should return an error if LoadProductByDataRepository return a product', async () => {
    const { sut, loadProductByDataRepositoryStub } = makeSut()
    jest.spyOn(loadProductByDataRepositoryStub, 'loadByData').mockReturnValueOnce(Promise.resolve(mockProductModel()))
    const response = await sut.add(params)
    expect(response).toEqual(new DataInUseError('trademark and reference'))
  })

  it('Should AddProductUseCase throw if LoadProductByDataRepository throws', async () => {
    const { sut, loadProductByDataRepositoryStub } = makeSut()
    jest.spyOn(loadProductByDataRepositoryStub, 'loadByData').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddProductRepository with correct value', async () => {
    const { sut, addProductRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addProductRepositoryStub, 'add')
    await sut.add(params)
    expect(addSpy).toHaveBeenCalledWith(params)
  })

  it('Should AddProductUseCase throw if AddProductRepository throws', async () => {
    const { sut, addProductRepositoryStub } = makeSut()
    jest.spyOn(addProductRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })

  it('Should return a product without optionals when params optionals undefined', async () => {
    const { sut } = makeSut()
    const paramsOptionalsUndefined = Object.assign({}, params, { price: undefined, details: undefined })
    const product = await sut.add(paramsOptionalsUndefined) as any
    expect(product).toBeTruthy()
    expect(product.price).toBeUndefined()
    expect(product.details).toBeUndefined()
    expect(product.storeId).toBe(params.storeId)
  })
  it('Should return a product without optionals when params without optionals', async () => {
    const { sut } = makeSut()
    const { price, details, ...paramsWithoutOptionals } = params
    const product = await sut.add(paramsWithoutOptionals) as any
    expect(product).toBeTruthy()
    expect(product.price).toBeUndefined()
    expect(product.details).toBeUndefined()
    expect(product.storeId).toBe(params.storeId)
  })

  it('Should AddProductUseCase return a product on success', async () => {
    const { sut } = makeSut()
    const product = await sut.add(params)
    expect(product).toEqual(mockProductModel())
  })
})
