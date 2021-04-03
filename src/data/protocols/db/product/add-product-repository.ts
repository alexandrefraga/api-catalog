import { ProductModel } from '@/domain/models/product-model'
import { AddProductUseCaseParams } from '@/domain/usecases/product/add-product'

export type AddProductRepositoryParams = AddProductUseCaseParams

export interface AddProductRepository {
  add (product: AddProductRepositoryParams): Promise<ProductModel>
}
