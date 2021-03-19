import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { SignatureTokenModel } from '@/domain/models/signature-token-model'
import { MongoHelper } from './mongo-helper'

export class SignatureTokenMongoRepository implements AddSignatureTokenRepository {
  async add (token: string): Promise<SignatureTokenModel> {
    const signatureCollection = await MongoHelper.getCollection('signatures')
    const result = await signatureCollection.insertOne({ token })
    return MongoHelper.map(result.ops[0])
  }
}
