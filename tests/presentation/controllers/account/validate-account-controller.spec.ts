import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { ValidateAccountController } from '@/presentation/controllers/account/validate-account-controller'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { mockValidateAccountParams, mockValidateAccount } from '../../../mocks'
import { SignatureTypes } from '@/domain/models/signature-token-model'
import { Controller } from '@/presentation/controllers/controller'
import { RequiredFields } from '@/presentation/validations'
const validateParams = mockValidateAccountParams()

type SutTypes = {
  sut: ValidateAccountController
  dbValidateAccountStub: ValidateAccount
}
const makeSut = (): SutTypes => {
  const dbValidateAccountStub = mockValidateAccount()
  const sut = new ValidateAccountController(dbValidateAccountStub)
  return {
    sut,
    dbValidateAccountStub
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
    expect(validations).toContainEqual(new RequiredFields(input, ['signature']))
  })

  test('Should call ValidateAccount with correct signature', async () => {
    const { sut, dbValidateAccountStub } = makeSut()
    const validateSpy = jest.spyOn(dbValidateAccountStub, 'validate')
    await sut.handle(validateParams)
    expect(validateSpy).toHaveBeenCalledWith(validateParams.signature, SignatureTypes.account)
  })

  test('Should return 500 if DbValidateAccount throws', async () => {
    const { sut, dbValidateAccountStub } = makeSut()
    jest.spyOn(dbValidateAccountStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(validateParams)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 401 if DbValidateAccount return false', async () => {
    const { sut, dbValidateAccountStub } = makeSut()
    jest.spyOn(dbValidateAccountStub, 'validate').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(validateParams)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 if DbValidateAccount on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(validateParams)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ msg: 'Confirmated user account!' })
  })
})
