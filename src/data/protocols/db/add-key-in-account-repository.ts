import { Key } from '@/domain/models/account-model'

export interface AddKeyInAccountRepository {
  addKey (id: string, key: Key): Promise<boolean>
}
