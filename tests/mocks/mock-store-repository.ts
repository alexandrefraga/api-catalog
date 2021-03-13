import { AddStoreRepository } from '@/data/protocols/db'
import { LoadStoreByDataParams, LoadStoreByDataRepository } from '@/data/protocols/db/load-store-repository'
import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/add-store'
import { mockStoreModel } from './mock-store'

export const mockLoadStoreByDataRepository = (): LoadStoreByDataRepository => {
  class LoadStoreByDataRepositoryStub implements LoadStoreByDataRepository {
    async loadByData (data: LoadStoreByDataParams): Promise<StoreModel> {
      return null
    }
  }
  return new LoadStoreByDataRepositoryStub()
}

export const mockAddStoreRepository = (): AddStoreRepository => {
  class AddStoreRepositoryStub implements AddStoreRepository {
    async add (data: AddStoreParams): Promise<StoreModel> {
      return mockStoreModel()
    }
  }
  return new AddStoreRepositoryStub()
}
