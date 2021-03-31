import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { ValidateAccountController } from '@/presentation/controllers/account/validate-account-controller'
import { Validation } from '@/presentation/protocolls'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { mockValidateAccountParams, mockValidator, mockValidateAccount } from '../../../mocks'
import { SignatureTypes } from '@/domain/models/signature-token-model'

const validateParams = mockValidateAccountParams()

type SutTypes = {
  sut: ValidateAccountController
  validatorStub: Validation
  dbValidateAccountStub: ValidateAccount
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const dbValidateAccountStub = mockValidateAccount()
  const sut = new ValidateAccountController(validatorStub, dbValidateAccountStub)
  return {
    sut,
    validatorStub,
    dbValidateAccountStub
  }
}
describe('ValidateAccount Controller', () => {
  test('Should call Validator with correct signature', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    await sut.execute(validateParams)
    expect(validateSpy).toHaveBeenCalledWith(validateParams)
  })

  test('Should return 400 if Validator return an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error('specific error')))
    const response = await sut.execute(validateParams)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('specific error'))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(validateParams)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should call ValidateAccount with correct signature', async () => {
    const { sut, dbValidateAccountStub } = makeSut()
    const validateSpy = jest.spyOn(dbValidateAccountStub, 'validate')
    await sut.execute(validateParams)
    expect(validateSpy).toHaveBeenCalledWith(validateParams.signature, SignatureTypes.account)
  })

  test('Should return 500 if DbValidateAccount throws', async () => {
    const { sut, dbValidateAccountStub } = makeSut()
    jest.spyOn(dbValidateAccountStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.execute(validateParams)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 401 if DbValidateAccount return false', async () => {
    const { sut, dbValidateAccountStub } = makeSut()
    jest.spyOn(dbValidateAccountStub, 'validate').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.execute(validateParams)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 if DbValidateAccount on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.execute(validateParams)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ msg: 'Confirmated user account!' })
  })
})
