import { LoadStoreByDataParams, LoadStoreByDataRepository } from '@/data/protocols/db/load-store-repository'
import { StoreModel } from '@/domain/models/store-model'

export const mockLoadStoreByDataRepository = (): LoadStoreByDataRepository => {
  class LoadStoreByDataRepositoryStub implements LoadStoreByDataRepository {
    async loadStoreByData (data: LoadStoreByDataParams): Promise<StoreModel> {
      return null
    }
  }
  return new LoadStoreByDataRepositoryStub()
}
