import { Validation } from '@/presentation/protocolls'

export const mockValidator = (): Validation => {
  class ValidatorStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}
