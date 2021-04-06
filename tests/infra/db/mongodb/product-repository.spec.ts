import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { ProductMongoRepository } from '@/infra/db/mongodb/product-repository'
import { mockAddProductUseCaseParams } from '@/../tests/mocks'

const params = mockAddProductUseCaseParams()
const loadByDataParams = ({
  trademark: params.trademark,
  reference: params.reference,
  storeId: params.storeId
})

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

  describe('loadByData', () => {
    test('Should return null if loadByData return null', async () => {
      const fakeProduct = Object.assign({}, params, { trademark: 'other_trademark' })
      await productCollection.insertOne(fakeProduct)
      const sut = makeSut()
      const product = await sut.loadByData(loadByDataParams)
      expect(product).toBeNull()
    })

    test('Should return a product if loadByData on success', async () => {
      await productCollection.insertOne(params)
      const sut = makeSut()
      const product = await sut.loadByData(loadByDataParams)
      expect(product).toBeTruthy()
      expect(product.id).toBeTruthy()
      expect(product.trademark).toBe(params.trademark)
      expect(product.storeId).toBe(params.storeId)
    })
  })

  describe('loadByStore', () => {
    test('Should return empty array if loadByStore return null', async () => {
      const sut = makeSut()
      const product = await sut.loadByStore(new ObjectId().toHexString())
      expect(product).toEqual([])
    })

    test('Should return products if loadByStore on success', async () => {
      await productCollection.insertOne(params)
      const sut = makeSut()
      const product = await sut.loadByStore(params.storeId)
      expect(product).toBeTruthy()
      expect(product[0].id).toBeTruthy()
      expect(product[0].trademark).toBe(params.trademark)
      expect(product[0].storeId).toBe(params.storeId)
    })
  })
})
