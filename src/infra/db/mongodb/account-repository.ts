import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountParams): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    const accountData = result.ops[0]
    const { _id, ...accountWithoutId } = accountData
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
