import { LoginRequestParameters, SignUpRequestParameters, ValidateAccountParams } from '@/presentation/protocolls'

export const mockLoginRequestParams = (): LoginRequestParameters => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockSignUpRequestParams = (): SignUpRequestParameters => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

export const mockValidateAccountParams = (): ValidateAccountParams => ({
  tokenValidation: 'any_token'
})
