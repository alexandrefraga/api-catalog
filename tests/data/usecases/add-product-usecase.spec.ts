import { mockAddProductUseCaseParams, mockProductModel } from '../../mocks/mock-product'
import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { AddProductUseCase } from '@/data/usecases/product/add-product-usecase'
import { mockLoadStoreByIdRepository } from '../../mocks'
import { DataInUseError, InvalidParamError } from '@/data/errors'
import { LoadProductByDataRepository } from '@/data/protocols/db/product/load-product-repository'
import { mockLoadProductByDataRepository } from '../../mocks/mock-product-repository'

const params = mockAddProductUseCaseParams()

type SutTypes = {
  sut: AddProductUseCase
  loadStoreByIdRepositoryStub: LoadStoreByIdRepository
  loadProductByDataRepositoryStub: LoadProductByDataRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByIdRepositoryStub = mockLoadStoreByIdRepository(true)
  const loadProductByDataRepositoryStub = mockLoadProductByDataRepository(false)
  const sut = new AddProductUseCase(loadStoreByIdRepositoryStub, loadProductByDataRepositoryStub)
  return {
    sut,
    loadStoreByIdRepositoryStub,
    loadProductByDataRepositoryStub
  }
}
describe('AddProduct Usecase', () => {
  test('Should call LoadStoreByIdRepository with correct value', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadStoreByIdRepositoryStub, 'loadById')
    await sut.add(params)
    expect(loadByIdSpy).toHaveBeenCalledWith(params.storeId)
  })

  test('Should return an error if LoadStoreByIdRepository return null', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(params)
    expect(response).toEqual(new InvalidParamError('storeId'))
  })

  test('Should AddProductUseCase throw if LoadStoreByIdRepository throws', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadProductByDataRepository with correct value', async () => {
    const { sut, loadProductByDataRepositoryStub } = makeSut()
    const loadByDataSpy = jest.spyOn(loadProductByDataRepositoryStub, 'loadByData')
    await sut.add(params)
    expect(loadByDataSpy).toHaveBeenCalledWith({
      trademark: params.trademark,
      reference: params.reference,
      storeId: params.storeId
    })
  })

  test('Should return an error if LoadProductByDataRepository return a product', async () => {
    const { sut, loadProductByDataRepositoryStub } = makeSut()
    jest.spyOn(loadProductByDataRepositoryStub, 'loadByData').mockReturnValueOnce(Promise.resolve(mockProductModel()))
    const response = await sut.add(params)
    expect(response).toEqual(new DataInUseError('trademark and reference'))
  })
})
