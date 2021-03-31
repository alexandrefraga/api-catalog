import { Key } from '@/domain/models/account-model'
import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'
import { AddKeyInAccountRepository } from '../../protocols/db/account/add-key-in-account-repository'

export class AddKeyInAccountUseCase implements AddKeyInAccount {
  constructor (
    private readonly addKeyInAccountRepository: AddKeyInAccountRepository
  ) {}

  async add (accountId: string, key: Key): Promise<void> {
    const saved = await this.addKeyInAccountRepository.addKey(accountId, key)
    if (!saved) { throw new Error() }
  }
}
