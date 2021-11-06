import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { Encrypter } from '@/data/protocols/criptography'
import { SignatureTokenModel, SignatureTypes, SignatureSubjectTypes } from '@/domain/models/signature-token-model'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'

export class AddSignatureTokenUseCase implements AddSignatureToken {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly AddSignatureTokenRepository: AddSignatureTokenRepository
  ) {}

  async add (id: string): Promise<SignatureTokenModel> {
    const token = await this.encrypter.encrypt(JSON.stringify({ id }))
    const signature = await this.AddSignatureTokenRepository.add(
      token,
      SignatureTypes.account,
      SignatureSubjectTypes.emailConfirmation
    )
    if (!signature) {
      throw new Error()
    }
    return signature
  }
}
