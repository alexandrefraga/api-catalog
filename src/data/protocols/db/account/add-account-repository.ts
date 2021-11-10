import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add (account: AddAccountParams): Promise<{ id: string }>
}
