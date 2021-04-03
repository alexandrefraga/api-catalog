import { AddProductRepository, AddProductRepositoryParams, LoadProductByDataParams, LoadProductByDataRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { MongoHelper } from './mongo-helper'

export class ProductMongoRepository implements AddProductRepository, LoadProductByDataRepository {
  async add (product: AddProductRepositoryParams): Promise<ProductModel> {
    const productCollection = await MongoHelper.getCollection('products')
    const result = await productCollection.insertOne(product)
    return MongoHelper.map(result.ops[0])
  }

  async loadByData (data: LoadProductByDataParams): Promise<ProductModel> {
    const productCollection = await MongoHelper.getCollection('products')
    const result = await productCollection.findOne(data)
    return result && MongoHelper.map(result)
  }
}
