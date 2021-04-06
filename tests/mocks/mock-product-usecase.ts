import { ProductModel } from '@/domain/models/product-model'
import { AddProduct, AddProductUseCaseParams } from '@/domain/usecases/product/add-product'
import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'
import { mockProductModel } from './mock-product'

export const mockAddProductUseCase = (): AddProduct => {
  class AddProductUseCaseStub implements AddProduct {
    async add (data: AddProductUseCaseParams): Promise<ProductModel> {
      return mockProductModel()
    }
  }
  return new AddProductUseCaseStub()
}

export const mockLoadProductsByStoreIdUseCase = (): LoadProductsByStore => {
  class LoadProductsByStoreIdUseCaseStub implements LoadProductsByStore {
    async loadByStore (storeId: string): Promise<ProductModel[]> {
      return [mockProductModel(), mockProductModel('other_id')]
    }
  }
  return new LoadProductsByStoreIdUseCaseStub()
}
