import { Validation } from '@/presentation/protocolls'
import { LoginController } from '@/presentation/controllers/login-controller'
import { mockValidator, mockAuthenticator, mockLoginRequestParams, mockAuthenticationResponse } from '../mocks'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { Authentication } from '@/domain/usecases/authentication'

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
    const request = mockLoginRequestParams()
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(mockLoginRequestParams())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const request = mockLoginRequestParams()
    await sut.execute(request)
    expect(authSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 401 if authentication reject credentials', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.execute(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.execute(mockLoginRequestParams())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockAuthenticationResponse())
  })
})
