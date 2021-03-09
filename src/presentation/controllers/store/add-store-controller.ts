import { AddStore } from '@/domain/usecases/add-store'
import { DataInUseError } from '@/presentation/errors/data-in-use-error'
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { AddStoreParameters, Controller, HttpResponse, Validation } from '@/presentation/protocolls'

export class AddStoreController implements Controller<AddStoreParameters> {
  constructor (
    private readonly validator: Validation,
    private readonly addStore: AddStore
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
      return success(store)
    } catch (error) {
      return serverError(error)
    }
  }
}
