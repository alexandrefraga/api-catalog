import { AddStoreRepository } from '@/data/protocols/db'
import { LoadStoreByDataParams, LoadStoreByDataRepository, LoadStoreByIdRepository } from '@/data/protocols/db/store/load-store-repository'
import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/store/add-store'
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
    async add (data: AddStoreParams): Promise<{ id: string }> {
      return { id: mockStoreModel().id }
    }
  }
  return new AddStoreRepositoryStub()
}

export const mockLoadStoreByIdRepository = (response: boolean): LoadStoreByIdRepository => {
  class LoadStoreByIdRepositoryStub implements LoadStoreByIdRepository {
    async loadById (id: string): Promise<StoreModel> {
      if (response) {
        return Promise.resolve(mockStoreModel())
      }
      return null
    }
  }
  return new LoadStoreByIdRepositoryStub()
}
