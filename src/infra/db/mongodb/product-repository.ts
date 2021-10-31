import { AddProductRepository, AddProductRepositoryParams, LoadProductByDataParams, LoadProductByDataRepository, LoadProductByStoreRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { MongoHelper } from './mongo-helper'

export class ProductMongoRepository implements AddProductRepository, LoadProductByDataRepository, LoadProductByStoreRepository {
  async add (product: AddProductRepositoryParams): Promise<ProductModel> {
    const productCollection = await MongoHelper.getCollection('products')
    const data: AddProductRepositoryParams = {
      description: product.description,
      trademark: product.trademark,
      reference: product.reference,
      storeId: product.storeId
    }
    if (product.details !== undefined) data.details = product.details
    if (product.price !== undefined) data.price = product.price
    const result = await productCollection.insertOne(data)
    return MongoHelper.mapInputWithId(data, result.insertedId)
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
