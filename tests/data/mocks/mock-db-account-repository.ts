import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { mockAccountModel } from '../../domain/mocks/mock-account'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'
import { UpdateTokenRepository } from '../protocols/db/update-token-repository'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockUpdateTokenRepository = (): UpdateTokenRepository => {
  class UpdateTokenRepositoryStub implements UpdateTokenRepository {
    async updateToken (token: string, id: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateTokenRepositoryStub()
}
