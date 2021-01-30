import { AccountModel } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { Hasher } from '../protocols/criptography/hasher'
import { AddAccountRepository } from '../protocols/db/add-account-repository'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    const passwordHashed = await this.hasher.hash(account.password)
    await this.addAccountRepository.add({
      name: account.name,
      email: account.email,
      password: passwordHashed
    })
    return Promise.resolve(null)
  }
}
