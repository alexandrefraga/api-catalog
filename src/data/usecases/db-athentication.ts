import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (data: AuthenticationParameters): Promise<AuthenticationResponse> {
    await this.loadAccountByEmailRepository.loadByEmail(data.email)
    return null
  }
}
