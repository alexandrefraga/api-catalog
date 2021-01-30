import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '../usecases/add-account'

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
