import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/protocolls/validation'

export type HttpResponse = {
  statusCode: number
  body: any
}

export abstract class Controller<T = any> {
  abstract perform (httpRequest: T): Promise<HttpResponse>

  buildValidators (httpRequest: T): Validation[] {
    return []
  }

  async handle (httpRequest: T): Promise<HttpResponse> {
    try {
      const error = await this.validate(httpRequest)
      if (error !== null) {
        return badRequest(error)
      }
      return await this.perform(httpRequest)
    } catch (error: any) {
      return serverError(error)
    }
  }

  private async validate (httpRequest: T): Promise<Error | null> {
    const response = await Promise.all(this.buildValidators(httpRequest).map(async v => await v.validate()))
    return Array.isArray(response) ? response.reduce((ac, e) => ac || e, null) : response
  }
}
