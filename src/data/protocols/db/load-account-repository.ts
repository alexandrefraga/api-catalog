import { AccountModel } from '@/domain/models/account-model'

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string, emailConfirmation?: Date): Promise<AccountModel>
}

export interface LoadAccountByTokenRepository {
  loadByToken (token: string): Promise<AccountModel>
}
