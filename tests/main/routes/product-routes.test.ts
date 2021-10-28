import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { mockAddProductUseCaseParams, mockAddStoreParams } from '../../mocks'
import { Role, TypeKey } from '@/domain/models/account-model'

let storeCollection: Collection
let accountCollection: Collection
let productCollection: Collection
let password: string
describe('Product Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    password = await hash('any_password', 12)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('/product/:storeId', () => {
    beforeEach(async () => {
      accountCollection = await MongoHelper.getCollection('accounts')
      storeCollection = await MongoHelper.getCollection('stores')
      await storeCollection.deleteMany({})
      await accountCollection.deleteMany({})
    })

    test('Should return 200 on add product if valid accessToken and storeId are provided', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        emailConfirmation: new Date(),
        password
      })
      const _id = account.insertedId
      const token = await sign({ id: _id }, env.jwtSecret)
      const store = await storeCollection.insertOne(mockAddStoreParams())
      const storeId: string = store.insertedId.toHexString()
      await accountCollection.updateOne({ _id }, {
        $set: {
          token,
          keys: [{
            id: 123456,
            typeKey: TypeKey.store,
            role: Role.storeAdmin,
            storeId,
            attributes: []
          }]
        }
      })
      await request(app)
        .post(`/api/product/${storeId}`)
        .set('x-access-token', token)
        .send({
          description: 'any_description',
          details: 'any_details',
          trademark: 'any_trademark',
          reference: 'any-reference',
          price: 100
        })
        .expect(200)
    })
  })

  describe('/products/:storeId', () => {
    beforeEach(async () => {
      accountCollection = await MongoHelper.getCollection('accounts')
      storeCollection = await MongoHelper.getCollection('stores')
      productCollection = await MongoHelper.getCollection('products')
      await storeCollection.deleteMany({})
      await accountCollection.deleteMany({})
      await productCollection.deleteMany({})
    })

    test('Should return 200 on get products if valid accessToken and storeId are provided', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        emailConfirmation: new Date(),
        password
      })
      const _id = account.insertedId
      const token = await sign({ id: _id }, env.jwtSecret)
      const store = await storeCollection.insertOne(mockAddStoreParams())
      const storeId: string = store.insertedId.toHexString()
      await accountCollection.updateOne({ _id }, { $set: { token } })
      await productCollection.insertMany([
        mockAddProductUseCaseParams(storeId),
        mockAddProductUseCaseParams(storeId),
        mockAddProductUseCaseParams('other_store_id'),
        mockAddProductUseCaseParams(storeId)
      ])
      await request(app)
        .get(`/api/products/${storeId}`)
        .set('x-access-token', token)
        .send()
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(3)
        })
    })
  })
})
