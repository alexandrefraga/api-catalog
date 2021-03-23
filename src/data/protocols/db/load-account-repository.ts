import { AccountModel, KeyRoute, Role } from '@/domain/models/account-model'

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string, emailConfirmation?: Date): Promise<AccountModel>
}

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: Role): Promise<AccountModel>
}

export interface LoadAccountByKeyRepository {
  loadByKey (token: string, key: KeyRoute): Promise<AccountModel>
}
