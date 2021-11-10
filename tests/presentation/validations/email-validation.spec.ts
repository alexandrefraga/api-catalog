import { EmailValidation } from '@/presentation/validations'
import { EmailValidator } from '@/presentation/protocolls'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { MockEmailValidator } from '../../mocks'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (input: any): SutTypes => {
  const emailValidatorStub = MockEmailValidator()
  const sut = new EmailValidation(input, 'email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}
describe('Email Validator', () => {
  it('Should return a MissingParamError if a required field not is provided', async () => {
    const { sut } = makeSut({})
    const response = await sut.validate()
    expect(response).toEqual(new MissingParamError('email'))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut({ email: 'this_email@mail.com' })
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.validate()
    expect(isValidSpy).toHaveBeenCalledWith('this_email@mail.com')
  })

  it('Should return InvalidParamerror if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut({ email: 'invalid_email' })
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const response = await sut.validate()
    expect(response).toEqual(new InvalidParamError('email'))
  })

  it('Should throw if EmailValidator trows', async () => {
    const { sut, emailValidatorStub } = makeSut({ email: 'any_email@mail.com' })
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate()
    await expect(promise).rejects.toThrow()
  })

  it('Should returns null if EmailValidator succeeds', async () => {
    const { sut } = makeSut({ email: 'any_email@mail.com' })
    const response = await sut.validate()
    expect(response).toBeNull()
  })
})
