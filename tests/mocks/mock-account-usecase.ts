import { AccountModel, Role } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/authentication'
import { mockAccountModel } from './mock-account'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

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

export const mockValidateAccount = (): ValidateAccount => {
  class ValidateAccountStub implements ValidateAccount {
    async validate (token: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new ValidateAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: Role): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
