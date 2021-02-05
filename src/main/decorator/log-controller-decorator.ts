import { Controller, HttpResponse } from '@/presentation/protocolls'

export class LogControllerDecorator implements Controller<any> {
  constructor (
    private readonly controller: Controller
  ) {}

  async execute (data: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.execute(data)
    if (httpResponse.statusCode === 500) {
      console.log('log...')
    }
    return httpResponse
  }
}
