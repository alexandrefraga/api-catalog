import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http-helper'
import { HttpResponse } from '../protocolls'
import { Middleware } from '../protocolls/middleware'

export class AuthMiddleware implements Middleware<any> {
  async execute (data: any): Promise<HttpResponse> {
    return Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
