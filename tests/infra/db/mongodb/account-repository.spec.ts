import { mockAddAccountParams } from '@/../tests/domain/mocks/mock-account'
import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'

type SutTypes = {
  sut: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()
  return {
    sut
  }
}
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeTruthy()
    expect(account.name).toBe(mockAddAccountParams().name)
  })
})
