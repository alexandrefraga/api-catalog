import { AccountModel, Role } from '@/domain/models/account-model'

export interface LoadAccountByToken {
  load (token: string, role?: Role): Promise<AccountModel>
}
