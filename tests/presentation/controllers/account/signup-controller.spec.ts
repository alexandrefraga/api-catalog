import { AddAccount } from '@/domain/usecases/add-account'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { EmailInUseError, ServerError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls/validation'
import { mockAddAccount, mockAddSignatureToken, mockSignUpRequestParams, mockValidator } from '../../../mocks'

const request = mockSignUpRequestParams()

type SutTypes = {
  sut: SignUpController
  validatorStub: Validation
  addAccountStub: AddAccount
  addSignatureTokenStub: AddSignatureToken
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const addAccountStub = mockAddAccount()
  const addSignatureTokenStub = mockAddSignatureToken()
  const sut = new SignUpController(validatorStub, addAccountStub, addSignatureTokenStub)
  return {
    sut,
    validatorStub,
    addAccountStub,
    addSignatureTokenStub
  }
}
describe('SignUpController', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.execute(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new EmailInUseError())
  })

  test('Should call AddSignatureToken with correct values', async () => {
    const { sut, addSignatureTokenStub } = makeSut()
    const addSpy = jest.spyOn(addSignatureTokenStub, 'add')
    await sut.execute(request)
    expect(addSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return 500 if AddSignatureToken throws', async () => {
    const { sut, addSignatureTokenStub } = makeSut()
    jest.spyOn(addSignatureTokenStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual('Sent confirmation email!')
  })
})
