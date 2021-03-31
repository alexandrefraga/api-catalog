import { Key } from '@/domain/models/account-model'

export interface AddKeyInAccount {
  add (accountId: string, key: Key): Promise<void>
}
