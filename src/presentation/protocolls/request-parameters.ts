export type SignUpRequestParameters = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginRequestParameters = {
  email: string
  password: string
}
