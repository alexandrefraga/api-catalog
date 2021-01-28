import { AccountModel } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { Hasher } from '../protocols/criptography/hasher'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    await this.hasher.hash(account.password)
    return Promise.resolve(null)
  }
}
