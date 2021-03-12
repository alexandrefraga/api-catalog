import { Validation } from '@/presentation/protocolls'
import { EmailValidator } from '@/validation/protocols'

export const mockValidator = (): Validation => {
  class ValidatorStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidatorStub()
}

export const MockEmailValidator = (): EmailValidator => {
  class FakeEmailValidator implements EmailValidator {
    isValid (email: string): boolean { return true }
  }
  return new FakeEmailValidator()
}
