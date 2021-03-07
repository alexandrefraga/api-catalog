import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../protocols/db/load-account-repository'
import { UpdateEmailRepository } from '../protocols/db/update-email-repository'

export class DbValidateAccount implements ValidateAccount {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByToken: LoadAccountByTokenRepository,
    private readonly updateEmailRepository: UpdateEmailRepository
  ) {}

  async validate (token: string): Promise<boolean> {
    try {
      await this.decrypter.decrypt(token)
    } catch (error) {
      return null
    }
    const { id, email } = await this.loadAccountByToken.loadByToken(token)
    const updated = await this.updateEmailRepository.updateEmail(id, email, new Date())
    return updated
  }
}
