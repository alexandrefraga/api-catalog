import { AddProduct } from '@/domain/usecases/product/add-product'
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocolls'
import { AddProductControllerParams } from '@/presentation/protocolls/request-parameters-product'
import { Validation } from '@/validation/protocols/validation'

export class AddProductController implements Controller<any> {
  constructor (
    private readonly validator: Validation,
    private readonly addProductUsecase: AddProduct
  ) {}

  async execute (data: AddProductControllerParams): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(data)
      if (error) {
        return badRequest(error)
      }
      const productOrError = await this.addProductUsecase.add(data)
      if (productOrError instanceof Error) {
        return forbidden(productOrError)
      }
      return success(productOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
