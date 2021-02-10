export type AuthenticationParameters = {
  email: string
  password: string
}

export type AuthenticationResponse = {
  token: string
  name: string
}

export interface Authentication {
  auth (data: AuthenticationParameters): Promise<AuthenticatorResponse>
}
