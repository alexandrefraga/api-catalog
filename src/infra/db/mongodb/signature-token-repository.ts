import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { UpdateUsedSignatureByTokenRepository } from '@/data/protocols/db/update-used-signature-by-token-repository'
import { SignatureTokenModel } from '@/domain/models/signature-token-model'
import { MongoHelper } from './mongo-helper'

export class SignatureTokenMongoRepository implements AddSignatureTokenRepository, UpdateUsedSignatureByTokenRepository {
  async add (token: string): Promise<SignatureTokenModel> {
    const signatureCollection = await MongoHelper.getCollection('signatures')
    const result = await signatureCollection.insertOne({ token })
    return MongoHelper.map(result.ops[0])
  }

  async updateUsed (token: string): Promise<boolean> {
    const signatureCollection = await MongoHelper.getCollection('signatures')
    const result = await signatureCollection.updateOne({ token }, { $set: { useDate: new Date() } })
    return !!result.modifiedCount
  }
}
