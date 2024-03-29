import { AddStoreRepository, LoadStoreByDataParams, LoadStoreByDataRepository, LoadStoreByIdRepository } from '@/data/protocols/db'
import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/store/add-store'
import { ObjectId } from 'bson'
import { MongoHelper } from './mongo-helper'

export class StoreMongoRepository implements AddStoreRepository, LoadStoreByIdRepository, LoadStoreByDataRepository {
  async add (data: AddStoreParams): Promise<{ id: string }> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const { insertedId } = await storeCollection.insertOne({ ...data })
    return { id: insertedId.toHexString() }
  }

  async loadById (id: string): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const store = await storeCollection.findOne({ _id: new ObjectId(id) })
    return store && MongoHelper.map(store)
  }

  async loadByData (data: LoadStoreByDataParams): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const store = await storeCollection.findOne({ ...data })
    return store && MongoHelper.map(store)
  }
}
