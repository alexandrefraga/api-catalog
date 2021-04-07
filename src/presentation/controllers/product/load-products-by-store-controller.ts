import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocolls'
import { LoadProductsByStoreControllerParams } from '@/presentation/protocolls/request-parameters-product'

export class LoadProductsByStoreController implements Controller<LoadProductsByStoreControllerParams> {
  constructor (
    private readonly validator: Validation,
    private readonly loadProductsByStoreUseCase: LoadProductsByStore
  ) {}

  async execute (data: LoadProductsByStoreControllerParams): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      const productOrError = await this.loadProductsByStoreUseCase.loadByStore(data.storeId)
      if (productOrError instanceof Error) {
        return forbidden(productOrError)
      }
      return success(productOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
