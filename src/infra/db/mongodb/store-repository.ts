import { AddStoreRepository, LoadStoreByDataParams, LoadStoreByDataRepository } from '@/data/protocols/db'
import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/store/add-store'
import { MongoHelper } from './mongo-helper'

export class StoreMongoRepository implements LoadStoreByDataRepository, AddStoreRepository {
  async loadByData (data: LoadStoreByDataParams): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const store = await storeCollection.findOne(data)
    return store && MongoHelper.map(store)
  }

  async add (data: AddStoreParams): Promise<StoreModel> {
    const storeModel = Object.assign({}, data, { usersAdmin: [data.userId] })
    delete storeModel.userId
    const storeCollection = await MongoHelper.getCollection('stores')
    const result = await storeCollection.insertOne(storeModel)
    return MongoHelper.map(result.ops[0])
  }
}
