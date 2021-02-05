import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocolls'

const mockController = (): Controller => {
  class ControllerStub implements Controller<{field: string}> {
    async execute (data: {field: string}): Promise<HttpResponse> {
      return Promise.resolve(success({ value: 'any_value' }))
    }
  }
  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
}
const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}
describe('Log Controller Decorator', () => {
  test('Should LogControllerDecorator calls a controller with correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const executeSpy = jest.spyOn(controllerStub, 'execute')
    await sut.execute({ field: 'this_value' })
    expect(executeSpy).toHaveBeenCalledWith({ field: 'this_value' })
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const response = await sut.execute({ field: 'this_value' })
    expect(response).toEqual(success({ value: 'any_value' }))
  })
})
