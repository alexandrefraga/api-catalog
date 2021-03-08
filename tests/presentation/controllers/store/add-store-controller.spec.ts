import { AddStoreController } from '@/presentation/controllers/store/add-store-controller'
import { Validation } from '@/presentation/protocolls'
import { mockValidator, mockAddStoreParams } from '../../mocks'

type SutTypes = {
  sut: AddStoreController
  validatorStub: Validation
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const sut = new AddStoreController(validatorStub)
  return {
    sut,
    validatorStub
  }
}
describe('AddStore Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockAddStoreParams()
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(mockAddStoreParams())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })
})
