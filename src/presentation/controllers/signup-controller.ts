import { Controller, SignUpRequestParameters, HttpResponse } from '../protocolls'

export class SignUpController implements Controller<SignUpRequestParameters> {
  async execute (request: SignUpRequestParameters): Promise<HttpResponse> {
    return Promise.resolve({
      statusCode: 400,
      body: new Error('Missing param: name')
    })
  }
}
