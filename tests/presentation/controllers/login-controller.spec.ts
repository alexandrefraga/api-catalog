import { LoginRequestParameters, Validation } from '@/presentation/protocolls'
import { LoginController } from '@/presentation/controllers/login-controller'
import { mockValidator } from '../mocks'

const fakeRequest = (): LoginRequestParameters => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

type SutTypes = {
  sut: LoginController
  validatorStub: Validation
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const sut = new LoginController(validatorStub)
  return {
    sut,
    validatorStub
  }
}
describe('LoginController', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = fakeRequest()
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
})
