import { KeyParams, KeyRoute } from '@/domain/models/account-model'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-Token'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, success } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocolls'
import { Middleware } from '../protocolls/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly key?: KeyRoute
  ) {}

  async execute (request: HttpRequest): Promise<HttpResponse> {
    try {
      const token = request.headers?.['x-access-token']
      const keyParams: KeyParams = this.key ? {
        typeKey: this.key.typeKey,
        role: this.key.role,
        attribute: this.key.attribute,
        storeId: this.key.requiredStoreId ? request.params?.storeId : null
      } : null

      if (token) {
        const account = await this.loadAccountByToken.load(token, keyParams)
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
