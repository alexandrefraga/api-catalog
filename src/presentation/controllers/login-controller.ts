import { Controller, HttpResponse, LoginRequestParameters, Validation } from '@/presentation/protocolls'

export class LoginController implements Controller<LoginRequestParameters> {
  constructor (private readonly validator: Validation) {}

  async execute (data: LoginRequestParameters): Promise<HttpResponse> {
    await this.validator.validate(data)
    return Promise.resolve(null)
  }
}
