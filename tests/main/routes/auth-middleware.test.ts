import request from 'supertest'
import app from '@/main/config/app'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '@/main/adapters/express-middleware-adapter'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { makeKeyAdmin, makeKeyAdminStore, makeKeyOperator, makeKeyOperatorStore, makeKeyRouteAdmin, makeKeyRouteAdminStore, makeKeyRouteOperator, makeKeyRouteOperatorStore } from '../../mocks'
import { Key } from '@/domain/models/account-model'

let storeCollection: Collection
let accountCollection: Collection
let password: string

const createUserInRepository = async (keys?: Key[]): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    emailConfirmation: new Date(),
    password,
    keys
  })
  const _id = result.insertedId
  const token = await sign({ id: _id }, env.jwtSecret)
  await accountCollection.updateOne({ _id }, { $set: { token } })
  return token
}
describe('Auth Middleware', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
    storeCollection = await MongoHelper.getCollection('stores')
    accountCollection = await MongoHelper.getCollection('accounts')
    password = await hash('any_password', 12)
  })

  beforeEach(async () => {
    await storeCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  it('Should return OK if a loged user is required', async () => {
    const token = await createUserInRepository()
    const logedAuth = adaptMiddleware(makeAuthMiddleware())
    app.post('/test_auth_loged', logedAuth, (req, res) => { res.status(200).send(req.body) })
    await request(app)
      .post('/test_auth_loged')
      .set('x-access-token', token)
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.body.userId).toBeTruthy()
      })
  })

  it('Should return OK if an system administrator user accesses the route and a correct key is required', async () => {
    const token = await createUserInRepository([makeKeyAdmin()])
    const logedAdmin = adaptMiddleware(makeAuthMiddleware(makeKeyRouteAdmin()))
    app.post('/test_auth_admin', logedAdmin, (req, res) => { res.status(200).send() })
    await request(app)
      .post('/test_auth_admin')
      .set('x-access-token', token)
      .send({})
      .expect(200)
  })

  it('Should return OK if an system operator user accesses the route and a correct key is required', async () => {
    const token = await createUserInRepository([makeKeyOperator()])
    const logedOperator = adaptMiddleware(makeAuthMiddleware(makeKeyRouteOperator()))
    app.post('/test_auth_operator', logedOperator, (req, res) => { res.status(200).send() })
    await request(app)
      .post('/test_auth_operator')
      .set('x-access-token', token)
      .send({})
      .expect(200)
  })

  it('Should return OK if an store administrator user accesses the route and a correct key is required', async () => {
    const token = await createUserInRepository([makeKeyAdminStore()])
    const logedAdminStore = adaptMiddleware(makeAuthMiddleware(makeKeyRouteAdminStore()))
    app.post('/test_auth_adm_store/:storeId', logedAdminStore, (req, res) => { res.status(200).send() })
    await request(app)
      .post('/test_auth_adm_store/store_id')
      .set('x-access-token', token)
      .send({})
      .expect(200)
  })

  it('Should return OK if an store operator user accesses the route and a correct key is required', async () => {
    const token = await createUserInRepository([makeKeyOperatorStore(), makeKeyOperatorStore('other_id')])
    const logedOperatorStore = adaptMiddleware(makeAuthMiddleware(makeKeyRouteOperatorStore()))
    app.post('/test_auth_op_store/:storeId', logedOperatorStore, (req, res) => { res.status(200).send() })
    await request(app)
      .post('/test_auth_op_store/store_id')
      .set('x-access-token', token)
      .send({})
      .expect(200)
    await request(app)
      .post('/test_auth_op_store/other_id')
      .set('x-access-token', token)
      .send()
      .expect(200)
  })
})
