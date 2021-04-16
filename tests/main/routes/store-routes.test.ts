import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import request from 'supertest'
import MockDate from 'mockdate'
import { mockAddStoreParams } from '../../mocks'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let storeCollection: Collection
let accountCollection: Collection
let password: string
describe('Store Routes', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
    password = await hash('any_password', 12)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  describe('/addStore', () => {
    beforeEach(async () => {
      storeCollection = await MongoHelper.getCollection('stores')
      accountCollection = await MongoHelper.getCollection('accounts')
      await storeCollection.deleteMany({})
      await accountCollection.deleteMany({})
    })
    test('Should return 403 on add store without accessToken', async () => {
      await request(app)
        .post('/api/store')
        .send(mockAddStoreParams())
        .expect(403)
    })

    test('Should return 200 on addStore if valid accessToken is provided', async () => {
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        emailConfirmation: new Date(),
        password
      })
      const _id = result.ops[0]._id
      const token = await sign({ id: _id }, env.jwtSecret)
      await accountCollection.updateOne({ _id }, { $set: { token } })
      await request(app)
        .post('/api/store')
        .set('x-access-token', token)
        .send(mockAddStoreParams())
        .expect(200)
    })
  })
})
