import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'
import { HasherComparer } from '../protocols/criptography/hasher-compare'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherComparer: HasherComparer
  ) {}

  async auth (data: AuthenticationParameters): Promise<AuthenticationResponse> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email)
    if (account) {
      await this.hasherComparer.compare(data.email, account.email)
    }
    return null
  }
}
