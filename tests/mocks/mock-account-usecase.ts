import { AccountModel, Key, KeyParams } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/account/authentication'
import { mockAccountModel } from './mock-account'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-Token'
import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}

export const mockAuthenticationResponse = (): AuthenticationResponse => ({
  token: 'any_token',
  name: 'any_name'
})

export const mockAuthenticator = (): Authentication => {
  class AuthenticatorStub implements Authentication {
    async auth (data: AuthenticationParameters): Promise<AuthenticationResponse> {
      return Promise.resolve(mockAuthenticationResponse())
    }
  }
  return new AuthenticatorStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, key?: KeyParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockAddKeyInAccountUseCase = (): AddKeyInAccount => {
  class AddKeyInAccountUseCaseStub implements AddKeyInAccount {
    async add (accountId: string, key: Key): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddKeyInAccountUseCaseStub()
}
