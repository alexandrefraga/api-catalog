import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocolls'
import { LoadProductsByStoreIDControllerParams } from '@/presentation/protocolls/request-parameters-product'

export class LoadProductsByStoreIDController implements Controller<LoadProductsByStoreIDControllerParams> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (data: LoadProductsByStoreIDControllerParams): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
