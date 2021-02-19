import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-repository'
import { Encrypter, HasherComparer } from '../protocols/criptography'
import { UpdateTokenRepository } from '../protocols/db/update-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherComparer: HasherComparer,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) {}

  async auth (data: AuthenticationParameters): Promise<AuthenticationResponse> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email)
    if (account) {
      const isValidPassword = await this.hasherComparer.compare(data.password, account.password)
      if (isValidPassword) {
        const token = await this.encrypter.encrypt(JSON.stringify({ id: account.id }))
        const inserted = await this.updateTokenRepository.updateToken(token, account.id)
        if (inserted) {
          return {
            token,
            name: account.name
          }
        }
      }
    }
    return null
  }
}
