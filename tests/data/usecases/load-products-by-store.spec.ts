import { mockLoadStoreByIdRepository } from '../../mocks'
import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { LoadProductsByStoreUseCase } from '@/data/usecases/product/load-products-by-store-usecase'
import { InvalidParamError } from '@/data/errors'

type SutTypes = {
  sut: LoadProductsByStoreUseCase
  loadStoreByIdRepositoryStub: LoadStoreByIdRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByIdRepositoryStub = mockLoadStoreByIdRepository(true)
  const sut = new LoadProductsByStoreUseCase(loadStoreByIdRepositoryStub)
  return {
    sut,
    loadStoreByIdRepositoryStub
  }
}
describe('LoadProductsByStore UseCase', () => {
  test('Should call LoadStoreByIdRepository with correct value', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadStoreByIdRepositoryStub, 'loadById')
    await sut.loadByStore('valid_storeId')
    expect(loadByIdSpy).toHaveBeenCalledWith('valid_storeId')
  })

  test('Should return an error if LoadStoreByIdRepository return null', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.loadByStore('valid_storeId')
    expect(response).toEqual(new InvalidParamError('storeId'))
  })

  test('Should throw if LoadStoreByIdRepository throws', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.loadByStore('valid_storeId')
    await expect(promise).rejects.toThrow()
  })
})
