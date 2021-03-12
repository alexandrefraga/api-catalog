import { EmailValidation } from '@/validation/validators/email-validation'
import { EmailValidator } from '@/validation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { MockEmailValidator } from '../../mocks'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = MockEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')
  return {
    sut,
    emailValidatorStub
  }
}
describe('', () => {
  test('Should return a MissingParamError if a required field not is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.validate({})
    expect(response).toEqual(new MissingParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.validate({ email: 'this_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('this_email@mail.com')
  })

  test('Should return InvalidParamerror if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const response = await sut.validate({ email: 'invalid_email' })
    expect(response).toEqual(new InvalidParamError('email'))
  })

  test('Should throw if EmailValidator trows', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate({ email: 'any_email@mail.com' })
    await expect(promise).rejects.toThrow()
  })

  test('Should returns null if EmailValidator succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.validate({ email: 'any_email@mail.com' })
    expect(response).toBeNull()
  })
})
