import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { SignatureTokenModel } from '@/domain/models/signature-token-model'
import { mockSignatureTokenModel } from './mock-signature-token'

export const mockAddSignatureTokenRepository = (): AddSignatureTokenRepository => {
  class AddSignatureTokenRepositoryStub implements AddSignatureTokenRepository {
    async add (token: string): Promise<SignatureTokenModel> {
      return Promise.resolve(mockSignatureTokenModel())
    }
  }
  return new AddSignatureTokenRepositoryStub()
}
