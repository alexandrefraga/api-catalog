import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '../protocols/criptography/decrypter'

export class DbValidateAccount implements ValidateAccount {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async validate (token: string): Promise<boolean> {
    await this.decrypter.decrypt(token)
    return null
  }
}
