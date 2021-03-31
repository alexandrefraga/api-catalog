import { SignatureTypes } from '../../models/signature-token-model'

export interface ValidateAccount {
  validate (token: string, type: SignatureTypes): Promise<boolean>
}
