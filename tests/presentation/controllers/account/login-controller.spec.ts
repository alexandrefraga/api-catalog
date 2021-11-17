import { Controller } from '@/presentation/controllers/controller'
import { LoginController, LoginParams } from '@/presentation/controllers/account/login-controller'
import { EmailValidator } from '@/presentation/protocolls'
import { EmailValidation, StringValidation } from '@/presentation/validations'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { Authentication } from '@/domain/usecases/account/authentication'
import { mockAuthenticator, mockAuthenticationResponse, MockEmailValidator } from '../../../mocks'

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
  let input: LoginParams
  beforeAll(() => {
    input = { email: 'any_email@mail.com', password: 'any_password' }
  })
  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new StringValidation({
      input,
      field: 'password',
      minLength: 6,
      maxLength: 12,
      required: true
    }))
    expect(validations).toContainEqual(new EmailValidation(input, 'email', MockEmailValidator()))
  })

  it('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    await sut.handle(input)
    expect(authSpy).toHaveBeenCalledWith(input)
  })

  it('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(input)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  it('Should return 401 if authentication reject credentials', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(input)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(input)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockAuthenticationResponse())
  })
})
