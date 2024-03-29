import { AddProductRepository, AddProductRepositoryParams, LoadProductByDataParams, LoadProductByDataRepository, LoadProductByStoreRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { MongoHelper } from './mongo-helper'

export class ProductMongoRepository implements AddProductRepository, LoadProductByDataRepository, LoadProductByStoreRepository {
  async add (data: AddProductRepositoryParams): Promise<{ id: string}> {
    const productCollection = await MongoHelper.getCollection('products')
    const { insertedId } = await productCollection.insertOne({ ...data })
    return { id: insertedId.toHexString() }
  }

  async loadByData (data: LoadProductByDataParams): Promise<ProductModel> {
    const productCollection = await MongoHelper.getCollection('products')
    const result = await productCollection.findOne({ ...data })
    return result && MongoHelper.map(result)
  }

  async loadByStore (storeId: string): Promise<ProductModel[]> {
    const productCollection = await MongoHelper.getCollection('products')
    const result = await productCollection.find({ storeId }).toArray()
    return result && MongoHelper.mapAll(result)
  }
}
