import { ProductModel } from '@/domain/models/product-model'

export interface LoadProductsByStore {
  loadByStore (data: { storeId: string }): Promise<ProductModel[] | Error>
}
