import { LogErrorRepository } from '@/data/protocols/db'
import { MongoHelper } from './mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async saveLog (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
