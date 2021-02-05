import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { Controller, HttpResponse } from '@/presentation/protocolls'

export class LogControllerDecorator implements Controller<any> {
  constructor (
    private readonly controller: Controller,
    private readonly logError: LogErrorRepository
  ) {}

  async execute (data: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.execute(data)
    if (httpResponse.statusCode === 500) {
      await this.logError.saveLog(httpResponse.body.stack)
    }
    return httpResponse
  }
}
