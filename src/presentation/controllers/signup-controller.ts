import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'
import { MissingParamError } from '@/presentation/errors'

export class SignUpController implements Controller<SignUpRequestParameters> {
  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    if (!request.name) {
      return Promise.resolve({
        statusCode: 400,
        body: new MissingParamError('name')
      })
    }
  }
}
