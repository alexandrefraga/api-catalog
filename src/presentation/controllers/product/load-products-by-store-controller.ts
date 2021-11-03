import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { HttpResponse, Validation } from '@/presentation/protocolls'
import { LoadProductsByStoreControllerParams } from '@/presentation/protocolls/request-parameters-product'
import { ValidationsBuilder } from '@/presentation/validations'
import { Controller } from '@/presentation/controllers/controller'

export class LoadProductsByStoreController extends Controller {
  constructor (
    private readonly loadProductsByStoreUseCase: LoadProductsByStore
  ) { super() }

  async perform (data: LoadProductsByStoreControllerParams): Promise<HttpResponse> {
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
