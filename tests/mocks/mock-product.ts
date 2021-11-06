import { ProductModel } from '@/domain/models/product-model'
import { AddProductUseCaseParams } from '@/domain/usecases/product/add-product'

export const mockAddProductUseCaseParams = (storeId: string = 'valid_storeId'): AddProductUseCaseParams => ({
  description: 'any_description',
  details: 'any_details',
  trademark: 'any_trademark',
  reference: 'any-reference',
  price: 100,
  storeId
})

export const mockProductModel = (id: string = 'valid_id'): ProductModel => {
  return Object.assign(mockAddProductUseCaseParams(), { id })
}
