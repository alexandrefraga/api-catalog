import { ProductModel } from '@/domain/models/product-model'

export type LoadProductByDataParams = {
  trademark: string
  reference: string
  storeId: string
}

export interface LoadProductByDataRepository {
  loadByData (data: LoadProductByDataParams): Promise<ProductModel>
}

export interface LoadProductByStoreRepository {
  loadByStore (storeId: string): Promise<ProductModel[]>
}
