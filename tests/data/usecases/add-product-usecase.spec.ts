import { mockAddProductUseCaseParams } from '../../mocks/mock-product'
import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { AddProductUseCase } from '@/data/usecases/product/add-product-usecase'
import { mockLoadStoreByIdRepository } from '../../mocks'
import { InvalidParamError } from '@/data/errors'

const params = mockAddProductUseCaseParams()

type SutTypes = {
  sut: AddProductUseCase
  loadStoreByIdRepositoryStub: LoadStoreByIdRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByIdRepositoryStub = mockLoadStoreByIdRepository(true)
  const sut = new AddProductUseCase(loadStoreByIdRepositoryStub)
  return {
    sut,
    loadStoreByIdRepositoryStub
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
})
