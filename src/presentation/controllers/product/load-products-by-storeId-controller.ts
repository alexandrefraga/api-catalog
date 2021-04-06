import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocolls'
import { LoadProductsByStoreIdControllerParams } from '@/presentation/protocolls/request-parameters-product'

export class LoadProductsByStoreIDController implements Controller<LoadProductsByStoreIdControllerParams> {
  constructor (
    private readonly validator: Validation,
    private readonly loadProductsByStoreIdUseCase: LoadProductsByStore
  ) {}

  async execute (data: LoadProductsByStoreIdControllerParams): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      const productOrError = await this.loadProductsByStoreIdUseCase.loadByStore(data.storeId)
      if (productOrError instanceof Error) {
        return forbidden(productOrError)
      }
      return success(productOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
