import { success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocolls'

export const mockController = (): Controller => {
  class ControllerStub implements Controller<{field: string}> {
    async execute (data: {field: string}): Promise<HttpResponse> {
      return Promise.resolve(success({ value: 'any_value' }))
    }
  }
  return new ControllerStub()
}
