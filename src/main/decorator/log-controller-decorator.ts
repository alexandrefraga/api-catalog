import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { HttpResponse } from '@/presentation/protocolls'
import { Controller } from '@/presentation/controllers/controller'

export class LogControllerDecorator extends Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logError: LogErrorRepository
  ) { super() }

  async perform (data: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(data)
    if (httpResponse.statusCode === 500) {
      await this.logError.saveLog(httpResponse.body.stack)
    }
    return httpResponse
  }
}
