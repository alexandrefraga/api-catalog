import { StoreModel } from '@/domain/models/store-model'
import { AddStore, AddStoreParams } from '@/domain/usecases/add-store'
import { LoadStoreByDataRepository } from '../protocols/db/load-store-repository'

export class AddStoreUseCase implements AddStore {
  constructor (
    private readonly loadStoreByData: LoadStoreByDataRepository
  ) {}

  async add (data: AddStoreParams): Promise<StoreModel> {
    const { company, tradingName, address } = data
    await this.loadStoreByData.loadStoreByData({ company, tradingName, address })
    return null
  }
}
