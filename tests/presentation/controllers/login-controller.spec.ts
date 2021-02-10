import { LoginRequestParameters, Validation } from '@/presentation/protocolls'
import { LoginController } from '@/presentation/controllers/login-controller'
import { mockValidator } from '../mocks'
import { ServerError } from '@/presentation/errors'

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

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(fakeRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error('this_error') })
    const httpResponse = await sut.execute(fakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })
})
