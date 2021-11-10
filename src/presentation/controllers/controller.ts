import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/protocolls/validation'

export type HttpResponse = {
  statusCode: number
  body: any
}

export abstract class Controller<T = any> {
  abstract perform (request: T): Promise<HttpResponse>

  buildValidators (request: T): Validation[] {
    return []
  }

  async handle (request: T): Promise<HttpResponse> {
    try {
      const error = await this.validate(request)
      if (error !== null) {
        return badRequest(error)
      }
      return await this.perform(request)
    } catch (error: any) {
      return serverError(error)
    }
  }

  private async validate (request: T): Promise<Error | null> {
    const response = await Promise.all(this.buildValidators(request).map(async v => await v.validate()))
    return Array.isArray(response) ? response.reduce((ac, e) => ac || e, null) : response
  }
}
