import { loginPath } from './paths'
import { badRequest, serverError, unauthorized } from './components'
import { loginResponseSchema, loginParamsSchema, errorSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Catalog',
    description: 'Api de catálogo de produtos por loja cadastrada',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    loginParamsSchema,
    loginResponseSchema,
    errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorized
  }
}
