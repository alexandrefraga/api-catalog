import { SignatureTokenModel } from '@/domain/models/signature-token-model'

export interface AddSignatureTokenRepository {
  add (token: string): Promise<SignatureTokenModel>
}
