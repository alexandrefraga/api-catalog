import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
type SutTypes = {
  sut: LogErrorMongoRepository
}
const makeSut = (): SutTypes => {
  const sut = new LogErrorMongoRepository()
  return {
    sut
  }
}
describe('LogError Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log with correct stack on success', async () => {
    const { sut } = makeSut()
    await sut.saveLog('any_stack')
    const error = await errorCollection.findOne({ stack: 'any_stack' })
    expect(error.stack).toBe('any_stack')
  })
})
