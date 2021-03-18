import { AccountModel, Role } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { mockAccountModel } from './mock-account'
import { LoadAccountByEmailRepository, LoadAccountByTokenRepository } from '@/data/protocols/db/load-account-repository'
import { UpdateTokenRepository } from '../data/protocols/db/update-token-repository'
import { UpdateEmailRepository } from '../data/protocols/db/update-email-repository'

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
    async loadByEmail (email: string, emailConfirmation?: Date): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: Role): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateTokenRepository = (): UpdateTokenRepository => {
  class UpdateTokenRepositoryStub implements UpdateTokenRepository {
    async updateToken (token: string, id: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new UpdateTokenRepositoryStub()
}

export const mockUpdateEmailRepository = (): UpdateEmailRepository => {
  class UpdateEmailRepositoryStub implements UpdateEmailRepository {
    async updateEmail (id: string, email: string, confirmation: Date): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new UpdateEmailRepositoryStub()
}
