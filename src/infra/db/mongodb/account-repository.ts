import { AccountModel, Key, KeyParams, Role, TypeKey } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import {
  AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByKeyRepository, LoadAccountByTokenRepository,
  UpdateEmailRepository, UpdateTokenRepository, UpdateKeyInAccountRepository
} from '@/data/protocols/db'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { ObjectId } from 'mongodb'
import { AddKeyInAccountRepository } from '@/data/protocols/db/account/add-key-in-account-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository,
  LoadAccountByTokenRepository, UpdateTokenRepository, UpdateEmailRepository, LoadAccountByKeyRepository,
  AddKeyInAccountRepository, UpdateKeyInAccountRepository {
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

  async loadByKey (token: string, key?: KeyParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const query: Object[] = []
    if (!key) {
      query.push({ $match: { token } })
    } else if (key.typeKey === TypeKey.app) {
      query.push({
        $match: {
          token,
          keys: {
            $elemMatch: {
              typeKey: { $in: [TypeKey.app] },
              role: { $in: [Role.systemAdmin, key.role] }
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
                    { $eq: ['$keys.typeKey', TypeKey.app] },
                    { $eq: ['$keys.role', Role.systemAdmin] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', TypeKey.app] },
                    { $eq: ['$keys.role', Role.systemOperator] },
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
    } else if (key.typeKey === TypeKey.store && key.storeId) {
      query.push({
        $match: {
          token,
          keys: {
            $elemMatch: {
              typeKey: { $in: [TypeKey.app, TypeKey.store] },
              role: { $in: [Role.systemAdmin, Role.systemOperator, Role.storeAdmin, key.role] }
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
                    { $eq: ['$keys.typeKey', TypeKey.app] },
                    { $eq: ['$keys.role', Role.systemAdmin] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', TypeKey.app] },
                    { $eq: ['$keys.role', Role.systemOperator] },
                    { $in: [key.attribute, '$keys.attributes'] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', TypeKey.store] },
                    { $eq: ['$keys.role', Role.storeAdmin] },
                    { $eq: ['$keys.storeId', key.storeId] }
                  ]
                }, {
                  $and: [
                    { $eq: ['$keys.typeKey', TypeKey.store] },
                    { $eq: ['$keys.role', Role.storeOperator] },
                    { $eq: ['$keys.storeId', key.storeId] },
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
    const response = await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { token: token } })
    return !!response.modifiedCount
  }

  async updateEmail (id: string, confirmation: Date, email?: string): Promise<boolean> {
    const setQuery = email ? { email: email, emailConfirmation: confirmation } : { emailConfirmation: confirmation }
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: setQuery
    })
    return !!response.modifiedCount
  }

  async addKey (id: string, key: Key): Promise<boolean> {
    const setQuery = key
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $push: { keys: { $each: [setQuery] } }
    })
    return !!response.matchedCount
  }

  async updateKey (id: string, key: Key): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, [{
      $project: {
        _id: 1,
        name: '$name',
        email: '$email',
        token: '$token',
        keys: {
          $map: {
            input: '$keys',
            as: 'item',
            in: {
              $cond: {
                if: { $eq: ['$$item.id', key.id] },
                then: key,
                else: '$$item'
              }
            }
          }
        }
      }
    }])
    return !!response.modifiedCount
  }
}
