import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/account/authentication'
import { Encrypter, HasherComparer } from '@/data/protocols/criptography'
import { LoadAccountByEmailRepository, UpdateTokenRepository } from '@/data/protocols/db'

export class AuthenticationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherComparer: HasherComparer,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) {}

  async auth ({ email, password }: AuthenticationParameters): Promise<AuthenticationResponse> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email, new Date())
    if (account) {
      const isValidPassword = await this.hasherComparer.compare(password, account.password)
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
