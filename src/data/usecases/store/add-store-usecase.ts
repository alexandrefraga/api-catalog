import { StoreModel } from '@/domain/models/store-model'
import { AddStore, AddStoreParams } from '@/domain/usecases/store/add-store'
import { AddStoreRepository } from '../../protocols/db'
import { LoadStoreByDataRepository } from '../../protocols/db/store/load-store-repository'

export class AddStoreUseCase implements AddStore {
  constructor (
    private readonly loadStoreRepository: LoadStoreByDataRepository,
    private readonly addStoreRepository: AddStoreRepository
  ) {}

  async add (data: AddStoreParams): Promise<StoreModel> {
    const { company, tradingName, address } = data
    const exist = await this.loadStoreRepository.loadByData({ company, tradingName, address })
    if (!exist) {
      const store = await this.addStoreRepository.add(data)
      return store
    }
    return null
  }
}
