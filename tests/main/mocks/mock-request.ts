import { LoginRequestParameters, SignUpRequestParameters } from '@/presentation/protocolls'

export const fakeSignUpRequestParams = (): SignUpRequestParameters => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_value',
  passwordConfirmation: 'any_value'
})

export const fakeLoginRequestParams = (): LoginRequestParameters => ({
  email: 'any_email@mail.com',
  password: 'any_value'
})
