import { AddStoreParams } from '@/domain/usecases/store/add-store'

export interface AddStoreRepository {
  add (data: AddStoreParams): Promise<{ id: string}>
}
