import { AccountModel, Key, KeyParams, Role } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { mockAccountModel } from './mock-account'
import { LoadAccountByEmailRepository, LoadAccountByKeyRepository, LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-repository'
import { UpdateTokenRepository } from '../data/protocols/db/account/update-token-repository'
import { UpdateEmailRepository } from '../data/protocols/db/account/update-email-repository'
import { AddKeyInAccountRepository } from '@/data/protocols/db/account/add-key-in-account-repository'

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

export const mockLoadAccountByKeyRepository = (): LoadAccountByKeyRepository => {
  class LoadAccountByKeyRepositoryStub implements LoadAccountByKeyRepository {
    async loadByKey (token: string, key?: KeyParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByKeyRepositoryStub()
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
    async updateEmail (id: string, confirmation: Date, emai?: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new UpdateEmailRepositoryStub()
}

export const mockAddKeyInAccountRepository = (): AddKeyInAccountRepository => {
  class AddKeyInAccountRepositoryStub implements AddKeyInAccountRepository {
    async addKey (id: string, key: Key): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddKeyInAccountRepositoryStub()
}
