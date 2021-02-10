import { LoginRequestParameters, Validation } from '@/presentation/protocolls'
import { LoginController } from '@/presentation/controllers/login-controller'
import { mockValidator } from '../mocks'
import { ServerError } from '@/presentation/errors'
import { Authentication, AuthenticationParameters } from '@/domain/usecases/authentication'

const mockAuthenticator = (): Authentication => {
  class AuthenticatorStub implements Authentication {
    async auth (data: AuthenticationParameters): Promise<AuthenticatorResponse> {
      return Promise.resolve(null)
    }
  }
  return new AuthenticatorStub()
}

const fakeRequest = (): LoginRequestParameters => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

type SutTypes = {
  sut: LoginController
  validatorStub: Validation
  authenticatorStub: Authentication
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const authenticatorStub = mockAuthenticator()
  const sut = new LoginController(validatorStub, authenticatorStub)
  return {
    sut,
    validatorStub,
    authenticatorStub
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

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(fakeRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(fakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const request = fakeRequest()
    await sut.execute(request)
    expect(authSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(fakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })
})
