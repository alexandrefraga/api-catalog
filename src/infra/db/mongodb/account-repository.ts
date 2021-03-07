import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { LoadAccountByEmailRepository, LoadAccountByTokenRepository } from '@/data/protocols/db/load-account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { UpdateTokenRepository } from '@/data/protocols/db/update-token-repository'
import { UpdateEmailRepository } from '@/data/protocols/db/update-email-repository'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateTokenRepository, UpdateEmailRepository {
  async add (account: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string, emailConfirmation?: Date): Promise<AccountModel> {
    const query = emailConfirmation === undefined ? { email } : { email, emailConfirmation: { $lte: emailConfirmation } }
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(query)
    return account && MongoHelper.map(account)
  }

  async loadByToken (token: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ token })
    return account && MongoHelper.map(account)
  }

  async updateToken (token: string, id: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({ _id: id }, { $set: { token: token } })
    return !!response.modifiedCount
  }

  async updateEmail (id: string, email: string, confirmation: Date): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        email: email,
        emailConfirmation: confirmation
      }
    })
    return !!response.modifiedCount
  }
}
