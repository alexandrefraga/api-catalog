import { SignatureTypes } from '@/domain/models/signature-token-model'
import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { Decrypter } from '../../protocols/criptography'
import { UpdateEmailRepository } from '../../protocols/db'
import { UpdateUsedSignatureByTokenRepository } from '../../protocols/db/update-used-signature-by-token-repository'

export class ValidateAccountUseCase implements ValidateAccount {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly signatureByTokenRepository: UpdateUsedSignatureByTokenRepository,
    private readonly emailRepository: UpdateEmailRepository
  ) {}

  async validate (token: string, type: SignatureTypes): Promise<boolean> {
    let accountId: string
    try {
      const decryptedToken = await this.decrypter.decrypt(token)
      accountId = decryptedToken.id
    } catch (error) {
      return null
    }
    const updatedSignature = await this.signatureByTokenRepository.updateUsed(token, type)
    if (updatedSignature) {
      const updatedEmail = await this.emailRepository.updateEmail(accountId, new Date())
      return updatedEmail
    }
    return null
  }
}
