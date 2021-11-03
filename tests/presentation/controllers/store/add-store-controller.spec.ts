import { AddStore } from '@/domain/usecases/store/add-store'
import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'
import { AddStoreController } from '@/presentation/controllers/store/add-store-controller'
import { ServerError } from '@/presentation/errors'
import { DataInUseError } from '@/presentation/errors/data-in-use-error'
import { RequiredFields } from '@/presentation/validations'
import { mockAddStoreUseCase, mockStoreModel, makeKeyAdminStore, mockAddKeyInAccountUseCase, mockAddStoreParameters, mockAddStoreParams } from '../../../mocks'
import MockDate from 'mockdate'
import { Controller } from '@/presentation/controllers/controller'

type SutTypes = {
  sut: AddStoreController
  addStoreUseCaseStub: AddStore
  addKeyInAccountUseCaseStub: AddKeyInAccount
}
const makeSut = (): SutTypes => {
  const addStoreUseCaseStub = mockAddStoreUseCase()
  const addKeyInAccountUseCaseStub = mockAddKeyInAccountUseCase()
  const sut = new AddStoreController(addStoreUseCaseStub, addKeyInAccountUseCaseStub)
  return {
    sut,
    addStoreUseCaseStub,
    addKeyInAccountUseCaseStub
  }
}
describe('AddStore Controller', () => {
  beforeAll(async () => { MockDate.set(new Date()) })

  afterAll(async () => { MockDate.reset() })

  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const input = {
      company: 'company',
      tradingName: 'tradingName',
      description: 'description',
      address: 'address',
      geoLocalization: 'geoLocalization',
      userId: 'userId',
      phoneNumber: ['phoneNumber'],
      email: 'email'
    }
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new RequiredFields(input, [
      'company', 'tradingName', 'description', 'address',
      'geoLocalization', 'userId', 'phoneNumber', 'email'
    ]))
  })

  test('Should call AddStoreUseCase with correct values', async () => {
    const { sut, addStoreUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(addStoreUseCaseStub, 'add')
    const request = mockAddStoreParameters()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith(mockAddStoreParams())
  })

  test('Should return 500 if AddStoreUseCase throws', async () => {
    const { sut, addStoreUseCaseStub } = makeSut()
    jest.spyOn(addStoreUseCaseStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(mockAddStoreParameters())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 403 if AddStoreUseCase return null', async () => {
    const { sut, addStoreUseCaseStub } = makeSut()
    jest.spyOn(addStoreUseCaseStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(mockAddStoreParameters())
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(new DataInUseError(''))
  })

  test('Should call AddKeyInAccount with correct values', async () => {
    const { sut, addKeyInAccountUseCaseStub } = makeSut()
    const addKeySpy = jest.spyOn(addKeyInAccountUseCaseStub, 'add')
    await sut.handle(mockAddStoreParameters())
    expect(addKeySpy).toHaveBeenCalledWith(mockAddStoreParameters().userId, makeKeyAdminStore())
  })

  test('Should return 500 if AddKeyInAccount throws', async () => {
    const { sut, addKeyInAccountUseCaseStub } = makeSut()
    jest.spyOn(addKeyInAccountUseCaseStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(mockAddStoreParameters())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  test('Should return 200 if AddStoreUseCase return a store', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockAddStoreParameters())
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(mockStoreModel())
  })
})
