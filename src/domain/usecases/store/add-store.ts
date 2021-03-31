import { Address, StoreModel } from '../../models/store-model'

export type AddStoreParams = {
  company: string
  tradingName: string
  description: string
  address: Address
  email: string
  phoneNumber: string[]
  geoLocalization: { lat: number, lng: number }
  userId: string
}

export interface AddStore {
  add(data: AddStoreParams): Promise<StoreModel>
}
