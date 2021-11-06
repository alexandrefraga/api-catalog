import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { AddProduct } from '@/domain/usecases/product/add-product'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/protocolls'
import { ValidationsBuilder } from '@/presentation/validations'

type AddProductParams = {
  description: string
  details?: string
  trademark: string
  reference: string
  price?: number
  storeId: string
}

export class AddProductController extends Controller<AddProductParams> {
  constructor (
    private readonly addProductUsecase: AddProduct
  ) { super() }

  async perform (data: AddProductParams): Promise<HttpResponse> {
    const productOrError = await this.addProductUsecase.add({ ...data })
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
