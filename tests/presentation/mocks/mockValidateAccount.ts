import { ValidateAccount } from '@/domain/usecases/validate-account'

export const mockValidateAccount = (): ValidateAccount => {
  class ValidateAccountStub implements ValidateAccount {
    async validate (token: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new ValidateAccountStub()
}
