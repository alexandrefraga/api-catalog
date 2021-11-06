import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '../domain/usecases/account/add-account'
import { AuthenticationParameters } from '../domain/usecases/account/authentication'

export const mockAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

export const mockAuthenticationParams = (): AuthenticationParameters => ({
  email: 'valid_email@mail.com',
  password: 'any_password'
})
