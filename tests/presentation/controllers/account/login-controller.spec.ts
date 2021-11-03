import { Authentication } from '@/domain/usecases/account/authentication'
import { LoginController } from '@/presentation/controllers/account/login-controller'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { mockAuthenticator, mockLoginRequestParams, mockAuthenticationResponse, MockEmailValidator } from '../../../mocks'
import { Controller } from '@/presentation/controllers/controller'
import { EmailValidation, RequiredFields } from '@/presentation/validations'
import { EmailValidator } from '@/presentation/protocolls'

type SutTypes = {
  sut: LoginController
  emailValidator: EmailValidator
  authenticatorStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidator = MockEmailValidator()
  const authenticatorStub = mockAuthenticator()
  const sut = new LoginController(emailValidator, authenticatorStub)
  return {
    sut,
    emailValidator,
    authenticatorStub
  }
}
describe('LoginController', () => {
  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const input = { email: 'any_email', password: 'any_password' }
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new RequiredFields(input, ['password']))
    expect(validations).toContainEqual(new EmailValidation(input, 'email', MockEmailValidator()))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const request = mockLoginRequestParams()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 401 if authentication reject credentials', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockAuthenticationResponse())
  })
})
