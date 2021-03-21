import { SignatureTokenModel, SignatureTypes } from '@/domain/models/signature-token-model'

export interface AddSignatureTokenRepository {
  add (token: string, type: SignatureTypes, subject?: string): Promise<SignatureTokenModel>
}
