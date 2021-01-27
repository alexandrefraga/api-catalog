import { EmailValidator } from '@/validation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

interface SutTypes {
  sut: EmailValidator
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()
  return {
    sut
  }
}

describe('Email Validation', () => {
  test('Should return false if validator returns false', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
})
