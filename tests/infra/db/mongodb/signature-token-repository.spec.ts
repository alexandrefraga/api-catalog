import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { SignatureTokenMongoRepository } from '@/infra/db/mongodb/signature-token-repository'
import MockDate from 'mockdate'
import { SignatureTypes } from '@/domain/models/signature-token-model'

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
    it('Should return an signature if add on success', async () => {
      const sut = makeSut()
      const signature = await sut.add('any_token', SignatureTypes.account, 'any_subject')
      expect(signature).toBeTruthy()
      expect(signature.id).toBeTruthy()
    })

    it('Should return an signature without subject if add on success', async () => {
      const sut = makeSut()
      const signature = await sut.add('any_token', SignatureTypes.account)
      expect(signature).toBeTruthy()
      expect(signature.id).toBeTruthy()
    })
  })

  describe('updateUsed', () => {
    it('Should return true if update on success', async () => {
      await signatureCollection.insertOne({ token: 'any_token', type: SignatureTypes.account })
      const sut = makeSut()
      const updated = await sut.updateUsed('any_token', SignatureTypes.account)
      expect(updated).toBe(true)
      const signature = await signatureCollection.findOne({ token: 'any_token' })
      expect(signature.useDate).toEqual(new Date())
    })
  })
})
