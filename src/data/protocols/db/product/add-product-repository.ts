import { ProductModel } from '@/domain/models/product-model'
import { AddProductUseCaseParams } from '@/domain/usecases/product/add-product'

export interface AddProductRepository {
  add (data: AddProductUseCaseParams): Promise<ProductModel>
}
