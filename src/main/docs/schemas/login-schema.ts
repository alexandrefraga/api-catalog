export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
}

export const loginResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    name: { type: 'string' }
  }
}
