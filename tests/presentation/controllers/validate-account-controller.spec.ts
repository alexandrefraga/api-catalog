import { ValidateAccountController } from '@/presentation/controllers/validate-account-controller'
import { ServerError } from '@/presentation/errors'
import { mockValidateAccountParams, mockValidator } from '../mocks'
import { Validation } from '@/presentation/protocolls'

const validateParams = mockValidateAccountParams()

type SutTypes = {
  sut: ValidateAccountController
  validatorStub: Validation
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const sut = new ValidateAccountController(validatorStub)
  return {
    sut,
    validatorStub
  }
}
describe('ValidateAccount Controller', () => {
  test('Should call validator with correct tokenValidation', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    await sut.execute(validateParams)
    expect(validateSpy).toHaveBeenCalledWith(validateParams.tokenValidation)
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
})
