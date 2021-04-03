import { AddProductRepository, AddProductRepositoryParams } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { MongoHelper } from './mongo-helper'

export class ProductMongoRepository implements AddProductRepository {
  async add (product: AddProductRepositoryParams): Promise<ProductModel> {
    const productCollection = await MongoHelper.getCollection('products')
    const result = await productCollection.insertOne(product)
    return MongoHelper.map(result.ops[0])
  }
}
