import { Key } from '@/domain/models/account-model'
import { SaveKeyInAccount } from '@/domain/usecases/save-key'
import { SaveKeyInAccountRepository } from '../protocols/db/save-key-in-account-repository'

export class SaveKeyInAccountUseCase implements SaveKeyInAccount {
  constructor (
    private readonly saveKeyInAccountRepository: SaveKeyInAccountRepository
  ) {}

  async save (accountId: string, key: Key): Promise<void> {
    const saved = await this.saveKeyInAccountRepository.saveKey(accountId, key)
    if (!saved) { throw new Error() }
  }
}
