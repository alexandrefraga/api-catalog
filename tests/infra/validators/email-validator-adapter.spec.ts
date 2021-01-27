import { EmailValidator } from '@/validation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

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
    const isValid = sut.isValid('this_email@mail.com')
    expect(isValid).toBe(false)
  })
})
