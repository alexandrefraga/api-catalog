import { ProductModel } from '@/domain/models/product-model'

export interface LoadProductsByStore {
  loadByStore (storeId: string): Promise<ProductModel[] | Error>
}
