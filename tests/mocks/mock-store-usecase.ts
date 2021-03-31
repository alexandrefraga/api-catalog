import { StoreModel } from '@/domain/models/store-model'
import { AddStore, AddStoreParams } from '@/domain/usecases/store/add-store'
import { mockStoreModel } from './mock-store'

export const mockAddStoreUseCase = (): AddStore => {
  class DbAddStoreStub implements AddStore {
    async add (data: AddStoreParams): Promise<StoreModel> {
      return mockStoreModel()
    }
  }
  return new DbAddStoreStub()
}
