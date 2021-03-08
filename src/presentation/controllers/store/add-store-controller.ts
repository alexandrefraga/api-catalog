import { badRequest } from '@/presentation/helpers/http-helper'
import { AddStoreParameters, Controller, HttpResponse, Validation } from '@/presentation/protocolls'

export class AddStoreController implements Controller<AddStoreParameters> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (data: AddStoreParameters): Promise<HttpResponse> {
    const error = await this.validator.validate(data)
    if (error) {
      return badRequest(error)
    }
    return null
  }
}
