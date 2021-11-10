import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { Encrypter } from '@/data/protocols/criptography'
import { SignatureTypes, SignatureSubjectTypes } from '@/domain/models/signature-token-model'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'

export class AddAccountSignatureUseCase implements AddSignatureToken {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly AddSignatureRepository: AddSignatureTokenRepository
  ) {}

  async add (data: { id: string }): Promise<{ token: string }> {
    const token = await this.encrypter.encrypt(JSON.stringify({ id: data.id }))
    const signature = await this.AddSignatureRepository.add(
      token,
      SignatureTypes.account,
      SignatureSubjectTypes.emailConfirmation
    )
    if (!signature) {
      throw new Error()
    }
    return { token }
  }
}
