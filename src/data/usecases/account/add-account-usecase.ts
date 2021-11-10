import { AddAccount, AddAccountParams, User } from '@/domain/usecases/account/add-account'
import { Hasher } from '../../protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '../../protocols/db'

export class AddAccountUseCase implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (request: AddAccountParams): Promise<User> {
    const { name, email, password } = this.map(request)
    const emailInUse = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!emailInUse) {
      const passwordHashed = await this.hasher.hash(password)
      const accountId = await this.addAccountRepository.add({ name, email, password: passwordHashed })
      return { id: accountId.id, name, email }
    }
    return null
  }

  map (request: AddAccountParams): AddAccountParams {
    return {
      name: request.name,
      email: request.email,
      password: request.password
    }
  }
}
