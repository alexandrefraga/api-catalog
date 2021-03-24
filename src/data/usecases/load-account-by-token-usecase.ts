import { AccountModel, KeyParams } from '@/domain/models/account-model'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Decrypter } from '../protocols/criptography'
import { LoadAccountByKeyRepository } from '../protocols/db'

export class LoadAccountByTokenUseCase implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountRepository: LoadAccountByKeyRepository
  ) {}

  async load (token: string, key?: KeyParams): Promise<AccountModel> {
    const decrypted = await this.decrypter.decrypt(token)
    if (decrypted) {
      const account = await this.loadAccountRepository.loadByKey(token, key)
      return account
    }
    return null
  }
}
