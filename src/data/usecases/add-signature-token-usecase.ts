import { SignatureTokenModel } from '@/domain/models/signature-token-model'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { Encrypter } from '../protocols/criptography'
import { AddSignatureTokenRepository } from '../protocols/db/add-signature-token-repository'

export class AddSignatureTokenUseCase implements AddSignatureToken {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly AddSignatureTokenRepository: AddSignatureTokenRepository
  ) {}

  async add (id: string): Promise<SignatureTokenModel> {
    const token = await this.encrypter.encrypt(JSON.stringify({ id }))
    const signature = await this.AddSignatureTokenRepository.add(token)
    if (!signature) {
      throw new Error()
    }
    return signature
  }
}
