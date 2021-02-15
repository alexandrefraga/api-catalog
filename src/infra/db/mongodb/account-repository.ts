import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { UpdateTokenRepository } from '@/data/protocols/db/update-token-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateTokenRepository {
  async add (account: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateToken (token: string, id: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({ _id: id }, { $set: { token: token } })
    return !!response.modifiedCount
  }
}
