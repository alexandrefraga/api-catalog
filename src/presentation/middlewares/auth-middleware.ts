import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocolls'
import { Middleware } from '../protocolls/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async execute (request: HttpRequest): Promise<HttpResponse> {
    const token = request.headers?.['x-access-token']
    if (token) {
      await this.loadAccountByToken.load(token)
    }
    return forbidden(new AccessDeniedError())
  }
}
