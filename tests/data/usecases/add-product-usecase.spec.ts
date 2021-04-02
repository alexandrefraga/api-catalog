import { mockAddProductUseCaseParams } from '../../mocks/mock-product'
import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { AddProductUseCase } from '@/data/usecases/product/add-product-usecase'
import { mockLoadStoreByIdRepository } from '../../mocks'

const params = mockAddProductUseCaseParams()

type SutTypes = {
  sut: AddProductUseCase
  loadStoreByIdRepositoryStub: LoadStoreByIdRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByIdRepositoryStub = mockLoadStoreByIdRepository(false)
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
})
