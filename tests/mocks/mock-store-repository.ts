import { LoadStoreByDataParams, LoadStoreByDataRepository } from '@/data/protocols/db/load-store-repository'
import { StoreModel } from '@/domain/models/store-model'
import { mockStoreModel } from './mock-store'

export const mockLoadStoreByDataRepository = (): LoadStoreByDataRepository => {
  class LoadStoreByDataRepositoryStub implements LoadStoreByDataRepository {
    async loadStoreByData (data: LoadStoreByDataParams): Promise<StoreModel> {
      return mockStoreModel()
    }
  }
  return new LoadStoreByDataRepositoryStub()
}
