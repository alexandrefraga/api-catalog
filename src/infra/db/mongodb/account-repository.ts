import { AccountModel, KeyRoute, Role } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByKeyRepository, LoadAccountByTokenRepository, UpdateEmailRepository, UpdateTokenRepository } from '@/data/protocols/db'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateTokenRepository, UpdateEmailRepository, LoadAccountByKeyRepository {
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

  async loadByToken (token: string, role?: Role): Promise<AccountModel> {
    const query = role ? { token, role: { $in: [Role.systemAdmin, role] } } : { token }
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(query)
    return account && MongoHelper.map(account)
  }

  async loadByKey (token: string, key?: KeyRoute): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const query: Object[] = []
    if (!key) {
      query.push({ $match: { token } })
    } else if (key.typeKey === 'app') {
      query.push({
        $match: {
          token,
          keys: {
            $elemMatch: {
              typeKey: { $in: ['app'] },
              role: { $in: ['system administrator', key.role] }
            }
          }
        }
      }, {
        $unwind: { path: '$keys' }
      }, {
        $redact: {
          $cond: {
            if: {
              $or: [
                {
                  $and: [
                    { $eq: ['$keys.typeKey', 'app'] },
                    { $eq: ['$keys.role', 'system administrator'] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', 'app'] },
                    { $eq: ['$keys.role', 'system operator'] },
                    { $in: [key.attribute, '$keys.attributes'] }
                  ]
                }
              ]
            },
            then: '$$KEEP',
            else: '$$PRUNE'
          }
        }
      })
    } else if (key.typeKey === 'store' && key.storeId) {
      query.push({
        $match: {
          token,
          keys: {
            $elemMatch: {
              typeKey: { $in: ['app', 'store'] },
              role: { $in: ['system administrator', 'system operator', 'store administrator', key.role] }
            }
          }
        }
      }, {
        $unwind: { path: '$keys' }
      }, {
        $redact: {
          $cond: {
            if: {
              $or: [
                {
                  $and: [
                    { $eq: ['$keys.typeKey', 'app'] },
                    { $eq: ['$keys.role', 'system administrator'] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', 'app'] },
                    { $eq: ['$keys.role', 'system operator'] },
                    { $in: [key.attribute, '$keys.attributes'] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', 'store'] },
                    { $eq: ['$keys.role', 'store administrator'] },
                    { $in: [key.storeId, '$keys.storeId'] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', 'store'] },
                    { $eq: ['$keys.role', 'store operator'] },
                    { $in: [key.storeId, '$keys.storeId'] },
                    { $in: [key.attribute, '$keys.attributes'] }
                  ]
                }
              ]
            },
            then: '$$KEEP',
            else: '$$PRUNE'
          }
        }
      })
    } else {
      query.push({ $match: { token } }, { $skip: 1 })
    }
    const account = await accountCollection.aggregate(query).toArray()
    return account.length ? MongoHelper.map(account[0]) : null
  }

  async updateToken (token: string, id: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({ _id: id }, { $set: { token: token } })
    return !!response.modifiedCount
  }

  async updateEmail (id: string, confirmation: Date, email?: string): Promise<boolean> {
    const setQuery = email ? { email: email, emailConfirmation: confirmation } : { email: email }
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: setQuery
    })
    return !!response.modifiedCount
  }
}
