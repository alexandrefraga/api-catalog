import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { mockAddStoreParams, mockInsertStoreParams } from '@/../tests/mocks'

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
      const { company, tradingName, address } = mockAddStoreParams()
      const store = await sut.loadByData({ company, tradingName, address })
      expect(store).toBeFalsy()
    })

    test('Should return a store if loadByData on success', async () => {
      await storeCollection.insertOne(mockInsertStoreParams())
      const sut = makeSut()
      const { company, tradingName, address } = mockAddStoreParams()
      const store = await sut.loadByData({ company, tradingName, address })
      expect(store).toBeTruthy()
      expect(store.company).toBe(company)
      expect(store.address).toEqual(address)
    })
  })
})
