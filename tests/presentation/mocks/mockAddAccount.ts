import { AccountModel } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'

export const mockAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valida_email@mail.com',
  password: 'valid_password'
})

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}
