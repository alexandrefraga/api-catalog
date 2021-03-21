import { SignatureTokenModel, SignatureTypes } from '@/domain/models/signature-token-model'

export interface AddSignatureToken {
  add(id: string, type: SignatureTypes, subject?: string): Promise<SignatureTokenModel>
}
