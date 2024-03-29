import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'
import { mockAddStoreParams } from '@/../tests/mocks'

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
    it('Should return null if loadByData fail', async () => {
      const sut = makeSut()
      const store = await sut.loadByData({
        company: addStoreParams.company,
        tradingName: addStoreParams.tradingName,
        address: addStoreParams.address
      })
      expect(store).toBeFalsy()
    })

    it('Should return a store if loadByData on success', async () => {
      await storeCollection.insertOne(addStoreParams)
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
    it('Should return a store if add on success', async () => {
      const sut = makeSut()
      const { id } = await sut.add(addStoreParams)
      expect(id).toBeTruthy()
    })
  })

  describe('LoadById', () => {
    it('Should return null if loadById fail', async () => {
      const sut = makeSut()
      const fakeId = new ObjectId().toHexString()
      const store = await sut.loadById(fakeId)
      expect(store).toBeFalsy()
    })

    it('Should return a store if loadById on success', async () => {
      const res = await storeCollection.insertOne(addStoreParams)
      const id = res.insertedId.toHexString()
      const sut = makeSut()
      const store = await sut.loadById(id)
      expect(store).toBeTruthy()
      expect(store.company).toBe(addStoreParams.company)
      expect(store.address).toEqual(addStoreParams.address)
    })
  })
})
