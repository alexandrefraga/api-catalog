import {
  mockAddAccountParams, makeKeyAdmin, makeKeyRouteAdmin, makeKeyOperator, makeKeyRouteOperator,
  makeKeyAdminStore, makeKeyRouteAdminStore, makeKeyRouteOperatorStore, makeKeyOperatorStore
} from '@/../tests/mocks'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'
import { Role } from '@/domain/models/account-model'

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
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: Role.systemAdmin })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('invalid_token', Role.systemAdmin)
      expect(account).toBeFalsy()
    })

    test('Should return null if no match in the required role ', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', Role.systemAdmin)
      expect(account).toBeFalsy()
    })

    test('Should return an account if no is required role', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
    })

    test('Should return the admin account with any role', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: Role.systemAdmin })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', Role.systemOperator)
      expect(account).toBeTruthy()
    })

    test('Should return an account if loadByToken on success', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', role: Role.systemAdmin })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', Role.systemAdmin)
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
      const response = await sut.updateEmail(fakeAccount._id, new Date(), fakeAccount.email)
      expect(response).toBe(true)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.emailConfirmation).toEqual(new Date())
    })

    test('Should return false if updateEmail fail', async () => {
      const sut = makeSut()
      const invalidId = new ObjectId().toHexString()
      const response = await sut.updateEmail(invalidId, new Date(), 'any_email')
      expect(response).toBeFalsy()
    })
  })

  describe('loadByKey', () => {
    test('Should return null if loadByKey fail', async () => {
      const sut = makeSut()
      const account = await sut.loadByKey('any_token')
      expect(account).toBeNull()
    })

    test('Should return null if no required key and invalid token is provided', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByKey('invalid_token')
      expect(account).toBeNull()
    })

    test('Should return an account if no required key on success', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByKey('any_token')
      expect(account).toBeTruthy()
    })

    test('Should return null if is required key and invalid token is provided', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', keys: [makeKeyAdmin()] })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByKey('invalid_token', makeKeyRouteAdmin())
      expect(account).toBeNull()
    })

    test('Should return null if valid token is provided and no match in the required key', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token' })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByKey('any_token', makeKeyRouteAdmin())
      expect(account).toBeNull()
    })

    test('Should return null if invalid token is provided and match in the required key', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', keys: [makeKeyAdmin()] })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByKey('invalid_token', makeKeyRouteAdmin())
      expect(account).toBeNull()
    })

    test('Should return the app admin account with any key required', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', keys: [makeKeyAdmin()] })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account1 = await sut.loadByKey('any_token', makeKeyRouteOperator())
      expect(account1).toBeTruthy()
      expect(account1.name).toBe(mockAddAccountParams().name)
      const account2 = await sut.loadByKey('any_token', makeKeyRouteAdminStore())
      expect(account2).toBeTruthy()
      const account3 = await sut.loadByKey('any_token', makeKeyRouteOperatorStore())
      expect(account3).toBeTruthy()
    })

    test('Should return the app operator account with a correct key or a store key required', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', keys: [makeKeyOperator()] })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account1 = await sut.loadByKey('any_token', makeKeyRouteOperator())
      expect(account1).toBeTruthy()
      const account2 = await sut.loadByKey('any_token', makeKeyRouteAdminStore())
      expect(account2).toBeTruthy()
      const account3 = await sut.loadByKey('any_token', makeKeyRouteOperatorStore())
      expect(account3).toBeTruthy()
    })

    test('Should return the store admin account with a correct key or an operator store key required', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', keys: [makeKeyAdminStore()] })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account1 = await sut.loadByKey('any_token', makeKeyRouteAdminStore())
      expect(account1).toBeTruthy()
      const account2 = await sut.loadByKey('any_token', makeKeyRouteOperatorStore())
      expect(account2).toBeTruthy()
    })

    test('Should return an account if valid token is provided and match in the required key', async () => {
      const fakeAccount = Object.assign({}, mockAddAccountParams(), { token: 'any_token', keys: [makeKeyOperatorStore()] })
      await accountCollection.insertOne(fakeAccount)
      const sut = makeSut()
      const account = await sut.loadByKey('any_token', makeKeyRouteOperatorStore())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })
  })
})
