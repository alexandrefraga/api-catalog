import { AccountModel } from '@/domain/models/account-model'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Decrypter } from '../protocols/criptography'
import { LoadAccountByTokenRepository } from '../protocols/db'

export class LoadAccountByTokenUseCase implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    const decrypted = await this.decrypter.decrypt(token)
    if (decrypted) {
      const account = await this.loadAccountRepository.loadByToken(token, role)
      return account
    }
    return null
  }
}
