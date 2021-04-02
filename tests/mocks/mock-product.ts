import { ProductModel } from '@/domain/models/product-model'
import { AddProductUseCaseParams } from '@/domain/usecases/product/add-product'
import { AddProductControllerParams } from '@/presentation/protocolls/request-parameters-product'

export const mockAddProductControllerParams = (): AddProductControllerParams => ({
  description: 'any_description',
  details: 'any_details',
  trademark: 'any_trademark',
  reference: 'any-reference',
  price: 100,
  storeId: 'valid_storeId'
})

export const mockAddProductUseCaseParams = (): AddProductUseCaseParams => ({
  description: 'any_description',
  details: 'any_details',
  trademark: 'any_trademark',
  reference: 'any-reference',
  price: 100,
  storeId: 'valid_storeId'
})

export const mockProductModel = (): ProductModel => {
  return Object.assign(mockAddProductUseCaseParams(), { id: 'valid_is' })
}
