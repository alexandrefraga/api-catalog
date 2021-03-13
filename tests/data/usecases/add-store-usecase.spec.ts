import { AddStoreUseCase } from '@/data/usecases/add-store-usecase'
import { AddStore } from '@/domain/usecases/add-store'
import { mockAddStoreParams, mockAddStoreRepository, mockLoadStoreByDataRepository, mockStoreModel } from '../../mocks'
import { AddStoreRepository, LoadStoreByDataRepository } from '@/data/protocols/db'

type SutTypes = {
  sut: AddStore
  loadStoreByDataRepositoryStub: LoadStoreByDataRepository
  addStoreRepositoryStub: AddStoreRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByDataRepositoryStub = mockLoadStoreByDataRepository()
  const addStoreRepositoryStub = mockAddStoreRepository()
  const sut = new AddStoreUseCase(loadStoreByDataRepositoryStub, addStoreRepositoryStub)
  return {
    sut,
    loadStoreByDataRepositoryStub,
    addStoreRepositoryStub
  }
}
const addStoreParams = mockAddStoreParams()
describe('AddStore UseCase', () => {
  test('Should call loadStoreByDataRepository with correct values', async () => {
    const { sut, loadStoreByDataRepositoryStub } = makeSut()
    const loadByDataSpy = jest.spyOn(loadStoreByDataRepositoryStub, 'loadByData')
    await sut.add(addStoreParams)
    expect(loadByDataSpy).toHaveBeenCalledWith({
      company: 'any_company',
      tradingName: 'any_trading_name',
      address: {
        street: 'any_street',
        number: 'any_number',
        city: 'any_city'
      }
    })
  })

  test('Should return null if loadStoreByDataRepository return a store', async () => {
    const { sut, loadStoreByDataRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByDataRepositoryStub, 'loadByData').mockReturnValueOnce(Promise.resolve(mockStoreModel()))
    const response = await sut.add(addStoreParams)
    expect(response).toBeNull()
  })

  test('Should throw if loadStoreByDataRepository throws', async () => {
    const { sut, loadStoreByDataRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByDataRepositoryStub, 'loadByData').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addStoreParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should call addStoreRepository with correct values', async () => {
    const { sut, addStoreRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addStoreRepositoryStub, 'add')
    await sut.add(addStoreParams)
    expect(addSpy).toHaveBeenCalledWith(addStoreParams)
  })

  test('Should throw if AddStoreRepository throws', async () => {
    const { sut, addStoreRepositoryStub } = makeSut()
    jest.spyOn(addStoreRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addStoreParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should return a store on success', async () => {
    const { sut } = makeSut()
    const store = await sut.add(addStoreParams)
    expect(store).toEqual(mockStoreModel())
  })
})
