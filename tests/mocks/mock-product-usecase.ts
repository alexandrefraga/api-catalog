import { ProductModel } from '@/domain/models/product-model'
import { AddProduct, AddProductUseCaseParams } from '@/domain/usecases/product/add-product'
import { mockProductModel } from './mock-product'

export const mockAddProductUseCase = (): AddProduct => {
  class AddProductUseCaseStub implements AddProduct {
    async add (data: AddProductUseCaseParams): Promise<ProductModel> {
      return mockProductModel()
    }
  }
  return new AddProductUseCaseStub()
}
