import { Key } from '@/domain/models/account-model'

export interface SaveKeyInAccountRepository {
  saveKey (id: string, key: Key): Promise<boolean>
}
