import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/protocolls'
import { ValidationsBuilder } from '@/presentation/validations'

export class LoadProductsByStoreController extends Controller<{ storeId: string }> {
  constructor (
    private readonly loadProductsByStoreUseCase: LoadProductsByStore
  ) { super() }

  async perform (request: { storeId: string }): Promise<HttpResponse> {
    const productOrError = await this.loadProductsByStoreUseCase.loadByStore(request)
    if (productOrError instanceof Error) {
      return forbidden(productOrError)
    }
    return success(productOrError)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .stringValidations({ field: 'storeId', minLength: 1, maxLength: 30, required: true })
      .build()
  }
}
