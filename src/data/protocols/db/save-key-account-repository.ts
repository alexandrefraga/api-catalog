import { Key } from '@/domain/models/account-model'

export interface SaveKeyAccountRepository {
  saveKey (id: string, key: Key): Promise<boolean>
}
