import { AddProduct } from '@/domain/usecases/product/add-product'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { HttpResponse, Validation } from '@/presentation/protocolls'
import { AddProductControllerParams } from '@/presentation/protocolls/request-parameters-product'
import { ValidationsBuilder } from '@/presentation/validations'
import { Controller } from '@/presentation/controllers/controller'

export class AddProductController extends Controller {
  constructor (
    private readonly addProductUsecase: AddProduct
  ) { super() }

  async perform (data: AddProductControllerParams): Promise<HttpResponse> {
    const productOrError = await this.addProductUsecase.add(data)
    if (productOrError instanceof Error) {
      return forbidden(productOrError)
    }
    return success(productOrError)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .requiredFields(['description', 'trademark', 'reference', 'storeId'])
      .build()
  }
}
