import { Role } from '@/domain/models/account-model'
import { AddStore } from '@/domain/usecases/add-store'
import { AddKeyInAccount } from '@/domain/usecases/add-key-in-account'
import { DataInUseError } from '@/presentation/errors/data-in-use-error'
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { storeKey } from '@/presentation/helpers/key-helper'
import { AddStoreParameters, Controller, HttpResponse, Validation } from '@/presentation/protocolls'

export class AddStoreController implements Controller<AddStoreParameters> {
  constructor (
    private readonly validator: Validation,
    private readonly addStore: AddStore,
    private readonly addKeyInAccount: AddKeyInAccount
  ) {}

  async execute (data: AddStoreParameters): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      const store = await this.addStore.add(data)
      if (!store) {
        return forbidden(new DataInUseError(''))
      }
      await this.addKeyInAccount.add(data.userId, storeKey(store.id, Role.storeAdmin))
      return success(store)
    } catch (error) {
      return serverError(error)
    }
  }
}
