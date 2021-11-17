import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { ValidateAccountController } from '@/presentation/controllers/account/validate-account-controller'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { Controller } from '@/presentation/controllers/controller'
import { StringValidation } from '@/presentation/validations'

const validateParams = { signature: 'any_token_with_long_length' }

class ValidateAccountStub implements ValidateAccount {
  async validate (data: { signature: string }): Promise<boolean> {
    return Promise.resolve(true)
  }
}

type SutTypes = {
  sut: ValidateAccountController
  validateAccountStub: ValidateAccount
}
const makeSut = (): SutTypes => {
  const validateAccountStub = new ValidateAccountStub()
  const sut = new ValidateAccountController(validateAccountStub
  )
  return {
    sut,
    validateAccountStub

  }
}

describe('ValidateAccount Controller', () => {
  it('should extend Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const input = { signature: 'any_token' }
    const validations = sut.buildValidators(input)
    expect(validations).toContainEqual(new StringValidation({
      input,
      field: 'signature',
      minLength: 20,
      maxLength: 600,
      required: true
    }))
  })

  it('Should call ValidateAccount with correct signature', async () => {
    const { sut, validateAccountStub } = makeSut()
    const validateSpy = jest.spyOn(validateAccountStub, 'validate')
    await sut.handle(validateParams)
    expect(validateSpy).toHaveBeenCalledWith(validateParams)
  })

  it('Should return 500 if DbValidateAccount throws', async () => {
    const { sut, validateAccountStub } = makeSut()
    jest.spyOn(validateAccountStub
      , 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(validateParams)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  it('Should return 401 if DbValidateAccount return false', async () => {
    const { sut, validateAccountStub } = makeSut()
    jest.spyOn(validateAccountStub
      , 'validate').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(validateParams)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 200 if DbValidateAccount on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(validateParams)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ msg: 'Confirmated user account!' })
  })
})
