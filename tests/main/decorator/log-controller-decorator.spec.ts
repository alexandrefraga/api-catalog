import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocolls'

const mockError = (): Error => {
  const error = new Error()
  error.stack = 'any_stack'
  return error
}
const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async saveLog (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

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
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
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

  test('Should calls LogErrorRepository with correct error if controler return 500', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'execute').mockReturnValueOnce(Promise.resolve(serverError(mockError())))
    const saveLogSpy = jest.spyOn(logErrorRepositoryStub, 'saveLog')
    await sut.execute({})
    expect(saveLogSpy).toHaveBeenCalledWith(mockError().stack)
  })
})
