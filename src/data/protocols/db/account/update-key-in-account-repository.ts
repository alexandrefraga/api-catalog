import { Key } from '@/domain/models/account-model'

export interface UpdateKeyInAccountRepository {
  updateKey (id: string, key: Key): Promise<boolean>
}
