import { SignatureTypes } from '@/domain/models/signature-token-model'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { SendMail } from '@/domain/usecases/send-mail-usecase'
import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { EmailInUseError, ServerError } from '@/presentation/errors'
import { Controller } from '@/presentation/controllers/controller'
import { mockAccountModel, mockAddAccount, mockAddSignatureToken, MockEmailValidator, mockSendMailUsecase, mockSignatureTokenModel, mockSignUpRequestParams } from '../../../mocks'
import { EmailValidation, RequiredFields, RequiredFieldsAndCompareValues } from '@/presentation/validations'
import { EmailValidator } from '@/presentation/protocolls'

const request = mockSignUpRequestParams()

type SutTypes = {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccountStub: AddAccount
  addSignatureTokenStub: AddSignatureToken
  sendMailUsecaseStub: SendMail
}

const makeSut = (): SutTypes => {
  const emailValidator = MockEmailValidator()
  const addAccountStub = mockAddAccount()
  const addSignatureTokenStub = mockAddSignatureToken(SignatureTypes.account)
  const sendMailUsecaseStub = mockSendMailUsecase()
  const sut = new SignUpController(emailValidator, addAccountStub, addSignatureTokenStub, sendMailUsecaseStub)
  return {
    sut,
    emailValidator,
    addAccountStub,
    addSignatureTokenStub,
    sendMailUsecaseStub
  }
}
describe('SignUpController', () => {
  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const input = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new RequiredFields(input, ['name']))
    expect(validations).toContainEqual(new RequiredFieldsAndCompareValues(input, 'password', 'passwordConfirmation'))
    expect(validations).toContainEqual(new EmailValidation(input, 'email', MockEmailValidator()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new EmailInUseError())
  })

  test('Should call AddSignatureToken with correct values', async () => {
    const { sut, addSignatureTokenStub } = makeSut()
    const addSpy = jest.spyOn(addSignatureTokenStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith('valid_id', SignatureTypes.account, 'email validation')
  })

  test('Should return 500 if AddSignatureToken throws', async () => {
    const { sut, addSignatureTokenStub } = makeSut()
    jest.spyOn(addSignatureTokenStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should call SendMailUseCase with correct values', async () => {
    const { sut, sendMailUsecaseStub } = makeSut()
    const sendSpy = jest.spyOn(sendMailUsecaseStub, 'send')
    await sut.handle(request)
    const { name, email } = mockAccountModel()
    const data = {
      subject: `Account confirmation to ${name}`,
      name,
      email,
      token: mockSignatureTokenModel(SignatureTypes.account).token
    }
    expect(sendSpy).toHaveBeenCalledWith(data)
  })

  test('Should return 500 if SendMailUseCase throws', async () => {
    const { sut, sendMailUsecaseStub } = makeSut()
    jest.spyOn(sendMailUsecaseStub, 'send').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual('Sent confirmation email!')
  })
})
