import { AddProduct } from '@/domain/usecases/product/add-product'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocolls'
import { AddProductControllerParams } from '@/presentation/protocolls/request-parameters-product'

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
      await this.addProductUsecase.add(data)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
