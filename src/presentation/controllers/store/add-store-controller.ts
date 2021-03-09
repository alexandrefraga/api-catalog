import { AddStore } from '@/domain/usecases/add-store'
import { badRequest, serverError, success } from '@/presentation/helpers/http-helper'
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
      if (store) {
        return success(store)
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
