import { AddProductRepository } from '@/data/protocols/db/product/add-product-repository'
import { LoadProductByDataParams, LoadProductByDataRepository, LoadProductByStoreRepository } from '@/data/protocols/db/product/load-product-repository'
import { ProductModel } from '@/domain/models/product-model'
import { mockProductModel } from './mock-product'

export const mockLoadProductByDataRepository = (response: boolean): LoadProductByDataRepository => {
  class LoadProductByDataRepositoryStub implements LoadProductByDataRepository {
    async loadByData (data: LoadProductByDataParams): Promise<ProductModel> {
      if (response) {
        return Promise.resolve(mockProductModel())
      }
      return Promise.resolve(null)
    }
  }
  return new LoadProductByDataRepositoryStub()
}

export const mockLoadProductByStoreRepository = (response: boolean): LoadProductByStoreRepository => {
  class LoadProductByStoreRepositoryStub implements LoadProductByStoreRepository {
    async loadByStore (storeId: string): Promise<ProductModel[]> {
      if (response) {
        return Promise.resolve([mockProductModel(), mockProductModel('other_id')])
      }
      return Promise.resolve(null)
    }
  }
  return new LoadProductByStoreRepositoryStub()
}

export const mockAddProductRepository = (): AddProductRepository => {
  class AddProductRepositoryStub implements AddProductRepository {
    async add (data: LoadProductByDataParams): Promise<ProductModel> {
      return Promise.resolve(mockProductModel())
    }
  }
  return new AddProductRepositoryStub()
}
