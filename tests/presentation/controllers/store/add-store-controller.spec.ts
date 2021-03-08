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
    await sut.execute(mockAddStoreParams())
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
})
