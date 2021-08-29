import { AddStoreRepository, LoadStoreByDataParams, LoadStoreByDataRepository, LoadStoreByIdRepository } from '@/data/protocols/db'
import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/store/add-store'
import { ObjectId } from 'bson'
import { MongoHelper } from './mongo-helper'

export class StoreMongoRepository implements AddStoreRepository, LoadStoreByIdRepository, LoadStoreByDataRepository {
  async add (data: AddStoreParams): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const result = await storeCollection.insertOne({
      company: data.company,
      tradingName: data.tradingName,
      description: data.description,
      address: data.address,
      email: data.email,
      phoneNumber: data.phoneNumber,
      geoLocalization: {
        lat: data.geoLocalization.lat,
        lng: data.geoLocalization.lng
      }
    })
    return MongoHelper.map(result.ops[0])
  }

  async loadById (id: string): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const store = await storeCollection.findOne({ _id: new ObjectId(id) })
    return store && MongoHelper.map(store)
  }

  async loadByData (data: LoadStoreByDataParams): Promise<StoreModel> {
    const storeCollection = await MongoHelper.getCollection('stores')
    const store = await storeCollection.findOne(data)
    return store && MongoHelper.map(store)
  }
}
