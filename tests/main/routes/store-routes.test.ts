import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import request from 'supertest'
import MockDate from 'mockdate'
import { mockAddStoreParams } from '../../mocks'
import { Collection } from 'mongodb'

let storeCollection: Collection
describe('Store Routes', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  describe('/addStore', () => {
    beforeEach(async () => {
      storeCollection = await MongoHelper.getCollection('stores')
      await storeCollection.deleteMany({})
    })
    test('Should return 200 if created store', async () => {
      await request(app)
        .post('/api/addStore')
        .send(mockAddStoreParams())
        .expect(200)
        .then(async () => {
          const store = await storeCollection.findOne({ company: 'any_company' })
          expect(store).toBeTruthy()
          expect(store.tradingName).toBe('any_trading_name')
        })
    })
  })
})
