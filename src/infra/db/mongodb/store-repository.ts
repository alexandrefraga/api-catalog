import { LoadStoreByDataParams, LoadStoreByDataRepository } from '@/data/protocols/db'
import { StoreModel } from '@/domain/models/store-model'
import { MongoHelper } from './mongo-helper'

export class StoreMongoRepository implements LoadStoreByDataRepository {
  async loadByData (data: LoadStoreByDataParams): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const store = await storeCollection.findOne(data)
    return store && MongoHelper.map(store)
  }
}
