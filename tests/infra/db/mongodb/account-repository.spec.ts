import { mockAddAccountParams } from '@/../tests/mocks/mock-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
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
  describe('add', () => {
    test('Should return an account if add on success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })
  })

  describe('loadByEmail', () => {
    test('Should return null if loadByEmail fail', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(mockAddAccountParams().email, new Date())
      expect(account).toBeFalsy()
    })

    test('Should return null if loadByEmail dont return an confirmated account', async () => {
      await accountCollection.insertOne(mockAddAccountParams())
      const sut = makeSut()
      const account = await sut.loadByEmail(mockAddAccountParams().email, new Date())
      expect(account).toBeNull()
    })

    test('Should return null if the confirmation date is later than the seach date', async () => {
      const accountConfirmated = Object.assign({}, mockAddAccountParams(), { emailConfirmation: new Date() })
      const result = await accountCollection.insertOne(accountConfirmated)
      const fakeAccount = result.ops[0]
      const sut = makeSut()
      const account = await sut.loadByEmail(fakeAccount.email, new Date(Date.now() - 1))
      expect(account).toBeNull()
    })

    test('Should return an account if loadByEmail on success', async () => {
      await accountCollection.insertOne(mockAddAccountParams())
      const sut = makeSut()
      const account = await sut.loadByEmail(mockAddAccountParams().email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })

    test('Should return an account confirmated if loadByEmail on success', async () => {
      const accountConfirmated = Object.assign({}, mockAddAccountParams(), { emailConfirmation: new Date() })
      await accountCollection.insertOne(accountConfirmated)
      const sut = makeSut()
      const account = await sut.loadByEmail(mockAddAccountParams().email, new Date())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
      expect(account.emailConfirmation).toEqual(new Date())
    })
  })

  describe('loadByToken', () => {
    test('Should return null if loadByToken fail', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })

    test('Should return null if invalid token is provided', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: 'admin' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('invalid_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return null if no match in the required role ', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: 'any_role' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account if no is required role', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: 'admin' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
    })

    test('Should return the admin account with any role', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: 'admin' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
    })

    test('Should return an account if loadByToken on success', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: 'admin' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })
  })

  describe('updateToken', () => {
    test('Should return true and update the account with a token if updateToken success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = result.ops[0]
      expect(fakeAccount.token).toBeFalsy()
      const response = await sut.updateToken('any_token', fakeAccount._id)
      expect(response).toBe(true)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.token).toBe('any_token')
    })

    test('Should return false if updateToken fail', async () => {
      const sut = makeSut()
      const response = await sut.updateToken('any_token', 'invalid_id')
      expect(response).toBeFalsy()
    })
  })

  describe('updateEmail', () => {
    test('Should return true and update the email as confirmed if updateEmail success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = result.ops[0]
      expect(fakeAccount.emailConfirmation).toBeFalsy()
      const response = await sut.updateEmail(fakeAccount._id, fakeAccount.email, new Date())
      expect(response).toBe(true)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.emailConfirmation).toEqual(new Date())
    })

    test('Should return false if updateEmail fail', async () => {
      const sut = makeSut()
      const invalidId = new ObjectId().toHexString()
      const response = await sut.updateEmail(invalidId, 'any_email', new Date())
      expect(response).toBeFalsy()
    })
  })
})
