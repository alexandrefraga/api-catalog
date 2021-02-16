import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { fakeLoginRequestParams, fakeSignUpRequestParams } from '../mocks/mock-request'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '@/presentation/errors'

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

  describe('/login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send(fakeLoginRequestParams())
        .expect(200)
    })

    test('Should return 401 on login if an unregistered email is provided', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid_email@mail.com',
          password
        })
        .expect(401)
        .then(response => {
          expect(response.body).toEqual({ error: new UnauthorizedError().message })
        })
    })

    test('Should return 401 on login if a incorrect password is provided', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'incorrect_password'
        })
        .expect(401)
        .then(response => {
          expect(response.body).toEqual({ error: new UnauthorizedError().message })
        })
    })

    test('Should return 400 on login if invalid email is provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid_email',
          password: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new InvalidParamError('email').message })
        })
    })

    test('Should return 400 on login if email no is provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          password: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new MissingParamError('email').message })
        })
    })

    test('Should return 400 on login if password no is provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new MissingParamError('password').message })
        })
    })
  })
})
