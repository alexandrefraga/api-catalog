import { SignatureTokenModel } from '@/domain/models/signature-token-model'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { mockSignatureTokenModel } from './mock-signature-token'

export const mockAddSignatureToken = (): AddSignatureToken => {
  class AddSignatureTokenStub implements AddSignatureToken {
    async add (id: string): Promise<SignatureTokenModel> {
      return Promise.resolve(mockSignatureTokenModel())
    }
  }
  return new AddSignatureTokenStub()
}
