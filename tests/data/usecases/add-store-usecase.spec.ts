import { AddStoreUseCase } from '@/data/usecases/add-store-usecase'
import { AddStore } from '@/domain/usecases/add-store'
import { mockAddStoreParams, mockLoadStoreByDataRepository } from '../../mocks'
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
describe('AddStore UseCase', () => {
  test('Should call loadStoreByDataRepository with correct values', async () => {
    const { sut, loadStoreByDataRepositoryStub } = makeSut()
    const loadStoreByDataSpy = jest.spyOn(loadStoreByDataRepositoryStub, 'loadStoreByData')
    await sut.add(mockAddStoreParams())
    expect(loadStoreByDataSpy).toHaveBeenCalledWith({
      company: 'any_company',
      tradingName: 'any_trading_name',
      address: {
        street: 'any_street',
        number: 'any_number',
        city: 'any_city'
      }
    })
  })
})
