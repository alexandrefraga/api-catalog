import { AccountModel, KeyParams } from '@/domain/models/account-model'

export interface LoadAccountByToken {
  load (token: string, key?: KeyParams): Promise<AccountModel>
}
