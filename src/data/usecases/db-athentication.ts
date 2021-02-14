import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'
import { Encrypter } from '../protocols/criptography/encrypter'
import { HasherComparer } from '../protocols/criptography/hasher-compare'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherComparer: HasherComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (data: AuthenticationParameters): Promise<AuthenticationResponse> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email)
    if (account) {
      const isValidPassword = await this.hasherComparer.compare(data.password, account.password)
      if (isValidPassword) {
        await this.encrypter.encrypt(account.id)
      }
    }
    return null
  }
}
