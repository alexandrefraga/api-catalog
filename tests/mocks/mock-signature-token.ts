import { SignatureTokenModel } from '@/domain/models/signature-token-model'

export const mockSignatureTokenModel = (): SignatureTokenModel => ({
  id: 'valid_id',
  token: 'valid_token',
  useDate: new Date()
})
