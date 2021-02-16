import { AccountModel } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { Hasher } from '../protocols/criptography/hasher'
import { AddAccountRepository } from '../protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-repository'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    const emailInUse = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (!emailInUse) {
      const passwordHashed = await this.hasher.hash(account.password)
      const accountData = await this.addAccountRepository.add(Object.assign(account, { password: passwordHashed }))
      return accountData
    }
    return null
  }
}
