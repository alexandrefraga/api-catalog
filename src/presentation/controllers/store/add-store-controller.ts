import { AddStoreParameters, Controller, HttpResponse, Validation } from '@/presentation/protocolls'

export class AddStoreController implements Controller<AddStoreParameters> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (data: AddStoreParameters): Promise<HttpResponse> {
    await this.validator.validate(data)
    return null
  }
}
