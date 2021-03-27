import { Key } from '@/domain/models/account-model'

export interface SaveKeyInAccount {
  save (accountId: string, key: Key): Promise<void>
}
