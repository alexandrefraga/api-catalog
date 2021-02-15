import { mockAddAccountParams } from '@/../tests/domain/mocks/mock-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'

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
})
