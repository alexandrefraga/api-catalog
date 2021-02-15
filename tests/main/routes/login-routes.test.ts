import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { fakeSignUpRequestParams } from '../mocks/mock-request'
import { Collection } from 'mongodb'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('/signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(fakeSignUpRequestParams())
        .expect(200)
    })
  })
})
