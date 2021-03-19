import { SignatureTokenModel } from '@/domain/models/signature-token-model'

export interface AddSignatureToken {
  add(id: string): Promise<SignatureTokenModel>
}
