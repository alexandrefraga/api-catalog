import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '../protocols/criptography/decrypter'
import { UpdateEmailRepository } from '../protocols/db/update-email-repository'

export class DbValidateAccount implements ValidateAccount {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly updateEmailRepository: UpdateEmailRepository
  ) {}

  async validate (token: string): Promise<boolean> {
    let dataDecrypted
    try {
      dataDecrypted = await this.decrypter.decrypt(token)
      if (!dataDecrypted.email || !dataDecrypted.id) { throw new Error() }
    } catch (error) {
      return null
    }
    const { id, email } = dataDecrypted
    const updated = await this.updateEmailRepository.updateEmail(id, email, new Date())
    return updated
  }
}
