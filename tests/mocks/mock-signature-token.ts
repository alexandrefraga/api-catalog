import { SignatureTokenModel, SignatureTypes } from '@/domain/models/signature-token-model'

export const mockSignatureTokenModel = (type: SignatureTypes): SignatureTokenModel => ({
  id: 'valid_id',
  token: 'valid_token',
  type,
  subject: 'any_subject',
  useDate: new Date()
})
