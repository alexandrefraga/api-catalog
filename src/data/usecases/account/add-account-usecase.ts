import { AccountModel } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Hasher } from '../../protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '../../protocols/db'

export class AddAccountUseCase implements AddAccount {
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
