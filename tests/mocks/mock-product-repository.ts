import { LoadProductByDataParams, LoadProductByDataRepository } from '@/data/protocols/db/product/load-product-repository'
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
