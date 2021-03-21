import { SignatureTypes } from '@/domain/models/signature-token-model'

export interface UpdateUsedSignatureByTokenRepository {
  updateUsed (token: string, type: SignatureTypes): Promise<boolean>
}
