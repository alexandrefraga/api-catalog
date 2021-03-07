/* eslint @typescript-eslint/no-var-requires: "off" */
import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { fakeLoginRequestParams, fakeSignUpRequestParams } from '../mocks/mock-request'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { EmailInUseError, InvalidParamError, MissingParamError, UnauthorizedError } from '@/presentation/errors'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import MockDate from 'mockdate'

const sendMailMock = jest.fn()
jest.mock('nodemailer')
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

beforeEach(() => {
  sendMailMock.mockClear()
  nodemailer.createTransport.mockClear()
})

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  describe('/signup', () => {
    test('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(fakeSignUpRequestParams())
        .expect(201)
        .then(async () => {
          const account = await accountCollection.findOne({ email: 'any_email@mail.com' })
          expect(account).toBeTruthy()
        })
    })

    test('Should return 400 on signup if name no is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new MissingParamError('name').message })
        })
    })

    test('Should return 400 on signup if password no is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          passwordConfirmation: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new MissingParamError('password or passwordConfirmation').message })
        })
    })

    test('Should return 400 on signup if passwordConfirmation no is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new MissingParamError('password or passwordConfirmation').message })
        })
    })

    test('Should return 400 on signup if email no is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new MissingParamError('email').message })
        })
    })

    test('Should return 400 on signup if invalid email is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any-name',
          email: 'invalid_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({ error: new InvalidParamError('email').message })
        })
    })

    test('Should return 403 on signup if email in use', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password
      })
      await request(app)
        .post('/api/signup')
        .send(fakeSignUpRequestParams())
        .expect(403)
        .then(response => {
          expect(response.body).toEqual({ error: new EmailInUseError().message })
        })
    })
  })

  describe('/login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        emailConfirmation: new Date(),
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

  describe('/confirmation', () => {
    test('Should return 200 on confirmation', async () => {
      const password = await hash('any_value', 12)
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password
      })
      const _id = result.ops[0]._id
      const tokenValidation = await sign({ id: _id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id
      }, {
        $set: {
          token: tokenValidation
        }
      })
      await request(app)
        .get(`/api/confirmation/${tokenValidation}`)
        .expect(200)
    })
  })
})
