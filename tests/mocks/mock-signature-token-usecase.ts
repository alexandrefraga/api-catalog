import { SignatureTokenModel, SignatureTypes } from '@/domain/models/signature-token-model'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { mockSignatureTokenModel } from './mock-signature-token'

export const mockAddSignatureToken = (type: SignatureTypes): AddSignatureToken => {
  class AddSignatureTokenStub implements AddSignatureToken {
    async add (id: string): Promise<SignatureTokenModel> {
      return Promise.resolve(mockSignatureTokenModel(type))
    }
  }
  return new AddSignatureTokenStub()
}
