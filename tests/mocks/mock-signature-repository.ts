import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { UpdateUsedSignatureByTokenRepository } from '@/data/protocols/db/update-used-signature-by-token-repository'
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

export const mockUpdateUsedSignatureByTokenRepository = (): UpdateUsedSignatureByTokenRepository => {
  class UpdateUsedSignatureByTokenRepositoryStub implements UpdateUsedSignatureByTokenRepository {
    async updateUsed (token: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new UpdateUsedSignatureByTokenRepositoryStub()
}
