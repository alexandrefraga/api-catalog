import { StoreModel } from '@/domain/models/store-model'
import { AddStore, AddStoreParams } from '@/domain/usecases/store/add-store'
import { AddStoreRepository } from '../../protocols/db'
import { LoadStoreByDataRepository } from '../../protocols/db/store/load-store-repository'

export class AddStoreUseCase implements AddStore {
  constructor (
    private readonly loadStoreRepository: LoadStoreByDataRepository,
    private readonly addStoreRepository: AddStoreRepository
  ) {}

  async add (request: AddStoreParams): Promise<StoreModel> {
    const data = this.map(request)
    const { company, tradingName, address } = data
    const exists = await this.loadStoreRepository.loadByData({ company, tradingName, address })
    if (!exists) {
      const storeId = await this.addStoreRepository.add(data)
      return Object.assign({}, data, storeId)
    }
    return null
  }

  map (request: AddStoreParams): AddStoreParams {
    return {
      company: request.company,
      tradingName: request.tradingName,
      description: request.description,
      address: request.address,
      email: request.email,
      phoneNumber: request.phoneNumber,
      geoLocalization: request.geoLocalization
    }
  }
}
