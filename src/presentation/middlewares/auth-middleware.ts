import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, success } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocolls'
import { Middleware } from '../protocolls/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async execute (request: HttpRequest): Promise<HttpResponse> {
    try {
      const token = request.headers?.['x-access-token']
      if (token) {
        const account = await this.loadAccountByToken.load(token)
        if (account) {
          return success({ userId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
