import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      })
      .expect(200)
  })
})
