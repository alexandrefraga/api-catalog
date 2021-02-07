import { SignUpController } from '@/presentation/controllers/signup-controller'
import { ServerError } from '@/presentation/errors'
import { Validation } from '../protocolls/validation'
import { mockValidator } from '../mocks'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account-model'
import { SignUpRequestParameters } from '../protocolls'

const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valida_email@mail.com',
        password: 'valid_password'
      }
      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

const fakeRequest = (): SignUpRequestParameters => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

type SutTypes = {
  sut: SignUpController
  validatorStub: Validation
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const addAccountStub = mockAddAccount()
  const sut = new SignUpController(validatorStub, addAccountStub)
  return {
    sut,
    validatorStub,
    addAccountStub
  }
}
describe('SignUpController', () => {
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
    const httpResponse = await sut.execute(fakeRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(fakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = fakeRequest()
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
    const httpResponse = await sut.execute(fakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any'))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const request = fakeRequest()
    const httpResponse = await sut.execute(request)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valida_email@mail.com',
      password: 'valid_password'
    })
  })
})
