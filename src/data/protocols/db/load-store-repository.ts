import { Address, StoreModel } from '@/domain/models/store-model'

export type LoadStoreByDataParams = {
  company: string
  tradingName: string
  address: Address
}

export interface LoadStoreByDataRepository {
  loadStoreByData (data: LoadStoreByDataParams): Promise<StoreModel>
}
