import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/protocolls'
import { ValidationsBuilder } from '@/presentation/validations'

export class LoadProductsByStoreController extends Controller<{ storeId: string }> {
  constructor (
    private readonly loadProductsByStoreUseCase: LoadProductsByStore
  ) { super() }

  async perform (data: { storeId: string }): Promise<HttpResponse> {
    const productOrError = await this.loadProductsByStoreUseCase.loadByStore(data.storeId)
    if (productOrError instanceof Error) {
      return forbidden(productOrError)
    }
    return success(productOrError)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .requiredFields(['storeId'])
      .build()
  }
}
