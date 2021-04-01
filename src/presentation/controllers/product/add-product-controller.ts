import { Controller, HttpResponse, Validation } from '@/presentation/protocolls'

export class AddProductController implements Controller<any> {
  constructor (
    private readonly validator: Validation
  ) {}

  async execute (data: any): Promise<HttpResponse> {
    await this.validator.validate(data)
    return Promise.resolve(null)
  }
}
