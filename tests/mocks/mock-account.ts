import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '../domain/usecases/add-account'
import { AuthenticationParameters } from '../domain/usecases/authentication'
import { LoginRequestParameters, SignUpRequestParameters, ValidateAccountParams } from '@/presentation/protocolls'

export const mockAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

export const mockSignUpRequestParams = (): SignUpRequestParameters => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

export const mockValidateAccountParams = (): ValidateAccountParams => ({
  tokenValidation: 'any_token'
})

export const mockLoginRequestParams = (): LoginRequestParameters => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationParams = (): AuthenticationParameters => ({
  email: 'valid_email@mail.com',
  password: 'any_password'
})
