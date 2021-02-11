import { Authentication, AuthenticationParameters, AuthenticationResponse } from '@/domain/usecases/authentication'

export const mockAuthenticationResponse = (): AuthenticationResponse => ({
  token: 'any_token',
  name: 'any_name'
})

export const mockAuthenticator = (): Authentication => {
  class AuthenticatorStub implements Authentication {
    async auth (data: AuthenticationParameters): Promise<AuthenticationResponse> {
      return Promise.resolve(mockAuthenticationResponse())
    }
  }
  return new AuthenticatorStub()
}
