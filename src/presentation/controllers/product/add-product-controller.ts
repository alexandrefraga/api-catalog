import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { Validation } from '@/presentation/protocolls'
import { ValidationsBuilder } from '@/presentation/validations'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { AddProduct } from '@/domain/usecases/product/add-product'

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

  async perform (request: AddProductParams): Promise<HttpResponse> {
    const product = await this.addProductUsecase.add(request)
    if (product instanceof Error) {
      return forbidden(product)
    }
    return success(product)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .stringValidations({ field: 'description', minLength: 10, maxLength: 200, required: true })
      .stringValidations({ field: 'details', minLength: 10, maxLength: 200, required: false })
      .stringValidations({ field: 'trademark', minLength: 3, maxLength: 30, required: true })
      .stringValidations({ field: 'reference', minLength: 1, maxLength: 30, required: true })
      .stringValidations({ field: 'storeId', minLength: 1, maxLength: 30, required: true })
      .build()
  }
}
