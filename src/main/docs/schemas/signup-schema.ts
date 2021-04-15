export const signupParamsSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    passwordConfirmation: { type: 'string' }
  },
  required: ['name', 'email', 'password', 'passwordConfirmation']
}

export const signupResponseSchema = {
  type: 'object',
  properties: {
    msg: { type: 'string' }
  }
}
