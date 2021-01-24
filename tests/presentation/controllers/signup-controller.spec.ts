import { SignUpController } from '@/presentation/controllers/signup-controller'
import { ServerError } from '@/presentation/errors'
import { Validation } from '../protocolls/validation'
import { mockValidator } from '../mocks'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account-model'

const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountParams): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valida_email@mail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

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
    const httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    await sut.execute(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    await sut.execute(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
