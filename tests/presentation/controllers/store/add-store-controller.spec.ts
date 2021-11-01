import { AddStore } from '@/domain/usecases/store/add-store'
import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'
import { AddStoreController } from '@/presentation/controllers/store/add-store-controller'
import { ServerError } from '@/presentation/errors'
import { DataInUseError } from '@/presentation/errors/data-in-use-error'
import { Validation } from '@/validation/protocols/validation'
import { mockValidator, mockAddStoreUseCase, mockStoreModel, makeKeyAdminStore, mockAddKeyInAccountUseCase, mockAddStoreParameters, mockAddStoreParams } from '../../../mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddStoreController
  validatorStub: Validation
  addStoreUseCaseStub: AddStore
  addKeyInAccountUseCaseStub: AddKeyInAccount
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const addStoreUseCaseStub = mockAddStoreUseCase()
  const addKeyInAccountUseCaseStub = mockAddKeyInAccountUseCase()
  const sut = new AddStoreController(validatorStub, addStoreUseCaseStub, addKeyInAccountUseCaseStub)
  return {
    sut,
    validatorStub,
    addStoreUseCaseStub,
    addKeyInAccountUseCaseStub
  }
}
describe('AddStore Controller', () => {
  beforeAll(async () => { MockDate.set(new Date()) })

  afterAll(async () => { MockDate.reset() })

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockAddStoreParameters()
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(mockAddStoreParameters())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(mockAddStoreParameters())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should call AddStoreUseCase with correct values', async () => {
    const { sut, addStoreUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(addStoreUseCaseStub, 'add')
    const request = mockAddStoreParameters()
    await sut.execute(request)
    expect(addSpy).toHaveBeenCalledWith(mockAddStoreParams())
  })

  test('Should return 500 if AddStoreUseCase throws', async () => {
    const { sut, addStoreUseCaseStub } = makeSut()
    jest.spyOn(addStoreUseCaseStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(mockAddStoreParameters())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 403 if AddStoreUseCase return null', async () => {
    const { sut, addStoreUseCaseStub } = makeSut()
    jest.spyOn(addStoreUseCaseStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.execute(mockAddStoreParameters())
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new DataInUseError(''))
  })

  test('Should call AddKeyInAccount with correct values', async () => {
    const { sut, addKeyInAccountUseCaseStub } = makeSut()
    const addKeySpy = jest.spyOn(addKeyInAccountUseCaseStub, 'add')
    await sut.execute(mockAddStoreParameters())
    expect(addKeySpy).toHaveBeenCalledWith(mockAddStoreParameters().userId, makeKeyAdminStore())
  })

  test('Should return 500 if AddKeyInAccount throws', async () => {
    const { sut, addKeyInAccountUseCaseStub } = makeSut()
    jest.spyOn(addKeyInAccountUseCaseStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(mockAddStoreParameters())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 200 if AddStoreUseCase return a store', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(mockAddStoreParameters())
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(mockStoreModel())
  })
})
