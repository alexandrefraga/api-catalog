import { mockLoadProductByStoreRepository, mockLoadStoreByIdRepository, mockProductModel, mockStoreModel } from '../../mocks'
import { LoadProductByStoreRepository, LoadStoreByIdRepository } from '@/data/protocols/db'
import { LoadProductsByStoreUseCase } from '@/data/usecases/product/load-products-by-store-usecase'
import { InvalidParamError } from '@/data/errors'

type SutTypes = {
  sut: LoadProductsByStoreUseCase
  loadStoreByIdRepositoryStub: LoadStoreByIdRepository
  loadProductByStoreRepositoryStub: LoadProductByStoreRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByIdRepositoryStub = mockLoadStoreByIdRepository(true)
  const loadProductByStoreRepositoryStub = mockLoadProductByStoreRepository(true)
  const sut = new LoadProductsByStoreUseCase(loadStoreByIdRepositoryStub, loadProductByStoreRepositoryStub)
  return {
    sut,
    loadStoreByIdRepositoryStub,
    loadProductByStoreRepositoryStub
  }
}
describe('LoadProductsByStore UseCase', () => {
  it('Should call LoadStoreByIdRepository with correct value', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadStoreByIdRepositoryStub, 'loadById')
    await sut.loadByStore({ storeId: 'valid_storeId' })
    expect(loadByIdSpy).toHaveBeenCalledWith('valid_storeId')
  })

  it('Should return an error if LoadStoreByIdRepository return null', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.loadByStore({ storeId: 'valid_storeId' })
    expect(response).toEqual(new InvalidParamError('storeId'))
  })

  it('Should throw if LoadStoreByIdRepository throws', async () => {
    const { sut, loadStoreByIdRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.loadByStore({ storeId: 'valid_storeId' })
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadProductByStoreRepository with correct value', async () => {
    const { sut, loadProductByStoreRepositoryStub } = makeSut()
    const loadByStoreSpy = jest.spyOn(loadProductByStoreRepositoryStub, 'loadByStore')
    await sut.loadByStore({ storeId: 'valid_storeId' })
    expect(loadByStoreSpy).toHaveBeenCalledWith(mockStoreModel().id)
  })

  it('Should throw if LoadProductByStoreRepository throws', async () => {
    const { sut, loadProductByStoreRepositoryStub } = makeSut()
    jest.spyOn(loadProductByStoreRepositoryStub, 'loadByStore').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.loadByStore({ storeId: 'valid_storeId' })
    await expect(promise).rejects.toThrow()
  })

  it('Should return products if LoadProductByStoreRepository on success', async () => {
    const { sut } = makeSut()
    const products = await sut.loadByStore({ storeId: 'valid_storeId' })
    expect(products[0]).toEqual(mockProductModel())
  })
})
