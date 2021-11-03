import { Validation, EmailValidator } from '@/presentation/protocolls'

export const mockValidator = (): Validation => {
  class ValidatorStub implements Validation {
    async validate (): Promise<Error> {
      return null
    }
  }
  return new ValidatorStub()
}

export const MockEmailValidator = (): EmailValidator => {
  class FakeEmailValidator implements EmailValidator {
    isValid (): boolean { return true }
  }
  return new FakeEmailValidator()
}
