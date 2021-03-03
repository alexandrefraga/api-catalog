import { mockAddAccountParams } from '@/../tests/domain/mocks/mock-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection, ObjectId } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
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
      const account = await sut.loadByEmail(mockAddAccountParams().email)
      expect(account).toBeFalsy()
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
      const response = await sut.updateEmail(fakeAccount._id, fakeAccount.email, true)
      expect(response).toBe(true)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.emailConfirmation).toBe(true)
    })

    test('Should return false if updateEmail fail', async () => {
      const sut = makeSut()
      const invalidId = new ObjectId().toHexString()
      const response = await sut.updateEmail(invalidId, 'any_email', true)
      expect(response).toBeFalsy()
    })
  })
})
