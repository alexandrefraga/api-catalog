import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { UpdateUsedSignatureByTokenRepository } from '@/data/protocols/db/update-used-signature-by-token-repository'
import { SignatureTypes } from '@/domain/models/signature-token-model'
import { MongoHelper } from './mongo-helper'

export class SignatureTokenMongoRepository implements AddSignatureTokenRepository, UpdateUsedSignatureByTokenRepository {
  async add (token: string, type: SignatureTypes, subject?: string): Promise<{ id: string }> {
    const data = subject ? { token, type, subject } : { token, type }
    const signatureCollection = await MongoHelper.getCollection('signatures')
    const { insertedId } = await signatureCollection.insertOne({ ...data })
    return { id: insertedId.toHexString() }
  }

  async updateUsed (token: string, type: SignatureTypes): Promise<boolean> {
    const signatureCollection = await MongoHelper.getCollection('signatures')
    const result = await signatureCollection.updateOne({ token, type }, { $set: { useDate: new Date() } })
    return !!result.modifiedCount
  }
}
