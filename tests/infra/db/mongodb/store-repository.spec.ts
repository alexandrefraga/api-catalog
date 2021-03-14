import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { mockAddStoreParams, mockInsertStoreParams } from '@/../tests/mocks'

const addStoreParams = mockAddStoreParams()

const makeSut = (): StoreMongoRepository => {
  return new StoreMongoRepository()
}

let storeCollection: Collection
describe('Store Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    storeCollection = await MongoHelper.getCollection('stores')
    await storeCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  describe('LoadByData', () => {
    test('Should return null if loadByData fail', async () => {
      const sut = makeSut()
      const store = await sut.loadByData({
        company: addStoreParams.company,
        tradingName: addStoreParams.tradingName,
        address: addStoreParams.address
      })
      expect(store).toBeFalsy()
    })

    test('Should return a store if loadByData on success', async () => {
      await storeCollection.insertOne(mockInsertStoreParams())
      const sut = makeSut()
      const store = await sut.loadByData({
        company: addStoreParams.company,
        tradingName: addStoreParams.tradingName,
        address: addStoreParams.address
      })
      expect(store).toBeTruthy()
      expect(store.company).toBe(addStoreParams.company)
      expect(store.address).toEqual(addStoreParams.address)
    })
  })

  describe('Add', () => {
    test('Should return a store if add on success', async () => {
      const sut = makeSut()
      const store = await sut.add(addStoreParams)
      expect(store).toBeTruthy()
      expect(store.company).toBe(addStoreParams.company)
      expect(store.address).toEqual(addStoreParams.address)
      expect(store.usersAdmin).toContain(addStoreParams.userId)
    })
  })
})
