import { HttpResponse } from '@/presentation/protocolls'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/protocolls/validation'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validation[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
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

  private async validate (httpRequest: any): Promise<Error | null> {
    const response = await Promise.all(this.buildValidators(httpRequest).map(async v => await v.validate()))
    return Array.isArray(response) ? response.reduce((ac, e) => ac || e, null) : response
  }
}
