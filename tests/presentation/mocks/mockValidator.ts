import { Validation } from '@/presentation/protocolls'

export const mockValidator = (): Validation => {
  class ValidatorStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidatorStub()
}
