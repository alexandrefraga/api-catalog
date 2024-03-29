import { success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/controllers/controller'

export const mockController = (): Controller => {
  class ControllerStub extends Controller {
    constructor (private readonly data = { value: 'any_value' }) { super() }
    async perform (data: {field: string}): Promise<HttpResponse> {
      return Promise.resolve(success(this.data))
    }
  }
  return new ControllerStub()
}
