import { SignatureTypes } from '@/domain/models/signature-token-model'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { SendMail } from '@/domain/usecases/send-mail-usecase'
import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { EmailInUseError, ServerError } from '@/presentation/errors'
import { Controller } from '@/presentation/controllers/controller'
import { mockAccountModel, mockAddAccount, MockEmailValidator, mockSendMailUsecase } from '../../../mocks'
import { EmailValidation, StringValidation, RequiredFieldsAndCompareValues } from '@/presentation/validations'
import { EmailValidator } from '@/presentation/protocolls'

const request = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
}

const mockAddAccountSignatureUsecase = (type: SignatureTypes): AddSignatureToken => {
  class AddSignatureTokenStub implements AddSignatureToken {
    async add (data: { id: string }): Promise<{ token: string }> {
      return Promise.resolve({ token: 'encrypted_value' })
    }
  }
  return new AddSignatureTokenStub()
}

type SutTypes = {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccountStub: AddAccount
  addAccountSignatureStub: AddSignatureToken
  sendMailUsecaseStub: SendMail
}

const makeSut = (): SutTypes => {
  const emailValidator = MockEmailValidator()
  const addAccountStub = mockAddAccount()
  const addAccountSignatureStub = mockAddAccountSignatureUsecase(SignatureTypes.account)
  const sendMailUsecaseStub = mockSendMailUsecase()
  const sut = new SignUpController(emailValidator, addAccountStub, addAccountSignatureStub, sendMailUsecaseStub)
  return {
    sut,
    emailValidator,
    addAccountStub,
    addAccountSignatureStub,
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
    expect(validations).toContainEqual(new StringValidation({
      input,
      field: 'name',
      minLength: 3,
      maxLength: 30,
      required: true
    }))
    expect(validations).toContainEqual(new StringValidation({
      input,
      field: 'password',
      minLength: 6,
      maxLength: 12,
      required: true
    }))
    expect(validations).toContainEqual(new RequiredFieldsAndCompareValues(input, 'password', 'passwordConfirmation'))
    expect(validations).toContainEqual(new EmailValidation(input, 'email', MockEmailValidator()))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password,
      passwordConfirmation: request.passwordConfirmation
    })
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new EmailInUseError())
  })

  it('Should call AddAccountSignature with correct values', async () => {
    const { sut, addAccountSignatureStub } = makeSut()
    const addSpy = jest.spyOn(addAccountSignatureStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({ id: 'valid_id' })
  })

  it('Should return 500 if AddAccountSignature throws', async () => {
    const { sut, addAccountSignatureStub } = makeSut()
    jest.spyOn(addAccountSignatureStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  it('Should call SendMailUseCase with correct values', async () => {
    const { sut, sendMailUsecaseStub } = makeSut()
    const sendSpy = jest.spyOn(sendMailUsecaseStub, 'send')
    await sut.handle(request)
    const { name, email } = mockAccountModel()
    const data = {
      subject: `Account confirmation to ${name}`,
      name,
      email,
      token: 'encrypted_value'
    }
    expect(sendSpy).toHaveBeenCalledWith(data)
  })

  it('Should return 500 if SendMailUseCase throws', async () => {
    const { sut, sendMailUsecaseStub } = makeSut()
    jest.spyOn(sendMailUsecaseStub, 'send').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  it('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual('Sent confirmation email!')
  })
})
