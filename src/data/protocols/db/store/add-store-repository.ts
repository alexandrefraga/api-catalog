import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/store/add-store'

export interface AddStoreRepository {
  add (data: AddStoreParams): Promise<StoreModel>
}
