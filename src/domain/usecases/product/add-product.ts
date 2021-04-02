import { ProductModel } from '@/domain/models/product-model'

export type AddProductUseCaseParams = {
  description: string
  details?: string
  trademark: string
  reference: string
  price?: number
  storeId: string
}

export interface AddProduct {
  add(data: AddProductUseCaseParams): Promise<ProductModel | Error>
}
