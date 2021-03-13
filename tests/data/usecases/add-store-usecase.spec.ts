import { AddStoreUseCase } from '@/data/usecases/add-store-usecase'
import { AddStore } from '@/domain/usecases/add-store'
import { mockAddStoreParams, mockLoadStoreByDataRepository, mockStoreModel } from '../../mocks'
import { LoadStoreByDataRepository } from '../protocols/db/load-store-repository'

type SutTypes = {
  sut: AddStore
  loadStoreByDataRepositoryStub: LoadStoreByDataRepository
}
const makeSut = (): SutTypes => {
  const loadStoreByDataRepositoryStub = mockLoadStoreByDataRepository()
  const sut = new AddStoreUseCase(loadStoreByDataRepositoryStub)
  return {
    sut,
    loadStoreByDataRepositoryStub
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

  test('Should AddStoreUseCase throw if loadStoreByDataRepository throws', async () => {
    const { sut, loadStoreByDataRepositoryStub } = makeSut()
    jest.spyOn(loadStoreByDataRepositoryStub, 'loadByData').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addStoreParams)
    await expect(promise).rejects.toThrow()
  })
})
