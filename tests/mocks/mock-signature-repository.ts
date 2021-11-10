import { AddSignatureTokenRepository } from '@/data/protocols/db/add-signature-token-repository'
import { UpdateUsedSignatureByTokenRepository } from '@/data/protocols/db/update-used-signature-by-token-repository'
import { SignatureTypes } from '@/domain/models/signature-token-model'

export const mockAddSignatureTokenRepository = (): AddSignatureTokenRepository => {
  class AddSignatureTokenRepositoryStub implements AddSignatureTokenRepository {
    async add (token: string, type: SignatureTypes, subject?: string): Promise<{ id: string}> {
      return Promise.resolve({ id: 'any_id' })
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
