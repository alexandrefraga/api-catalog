import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { fakeSignUpRequestParams } from '../mocks/mock-request'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send(fakeSignUpRequestParams())
      .expect(200)
  })
})
