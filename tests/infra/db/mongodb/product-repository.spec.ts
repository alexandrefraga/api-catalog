import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { ProductMongoRepository } from '@/infra/db/mongodb/product-repository'
import { mockAddProductUseCaseParams } from '@/../tests/mocks'

const params = mockAddProductUseCaseParams()

const makeSut = (): ProductMongoRepository => {
  return new ProductMongoRepository()
}

let productCollection: Collection
describe('Product Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    productCollection = await MongoHelper.getCollection('products')
    await productCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('add', () => {
    test('Should return a product if add on success', async () => {
      const sut = makeSut()
      const product = await sut.add(params)
      expect(product).toBeTruthy()
      expect(product.id).toBeTruthy()
      expect(product.trademark).toBe(params.trademark)
      expect(product.reference).toBe(params.reference)
      expect(product.storeId).toBe(params.storeId)
    })
  })
})
