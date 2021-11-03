import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { Controller } from '@/presentation/controllers/controller'
import { serverError, success } from '@/presentation/helpers/http-helper'
import { mockStackError, mockController, mockLogErrorRepository } from '../../mocks'

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
    const executeSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle({ field: 'this_value' })
    expect(executeSpy).toHaveBeenCalledWith({ field: 'this_value' })
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({ field: 'this_value' })
    expect(response).toEqual(success({ value: 'any_value' }))
  })

  test('Should calls LogErrorRepository with correct error if controler return 500', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(serverError(mockStackError())))
    const saveLogSpy = jest.spyOn(logErrorRepositoryStub, 'saveLog')
    await sut.handle({})
    expect(saveLogSpy).toHaveBeenCalledWith(mockStackError().stack)
  })
})
