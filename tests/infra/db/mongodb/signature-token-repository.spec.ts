import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { SignatureTokenMongoRepository } from '@/infra/db/mongodb/signature-token-repository'
import MockDate from 'mockdate'

const makeSut = (): SignatureTokenMongoRepository => {
  return new SignatureTokenMongoRepository()
}

let signatureCollection: Collection
describe('Signature Token Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    signatureCollection = await MongoHelper.getCollection('signatures')
    await signatureCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })
  describe('add', () => {
    test('Should return an signature if add on success', async () => {
      const sut = makeSut()
      const signature = await sut.add('any_token')
      expect(signature).toBeTruthy()
      expect(signature.id).toBeTruthy()
      expect(signature.token).toBe('any_token')
    })
  })
})
