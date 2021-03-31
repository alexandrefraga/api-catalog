import { AccountModel } from '@/domain/models/account-model'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add (account: AddAccountParams): Promise<AccountModel>
}
