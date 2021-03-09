import { StoreModel } from '@/domain/models/store-model'
import { AddStore, AddStoreParams } from '@/domain/usecases/add-store'

export class AddStoreUseCase implements AddStore {
  async add (data: AddStoreParams): Promise<StoreModel> {
    return null
  }
}
