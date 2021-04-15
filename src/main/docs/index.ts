import { signupPath, loginPath } from './paths'
import { badRequest, serverError, unauthorized, forbidden } from './components'
import {
  signupParamsSchema, signupResponseSchema,
  loginResponseSchema, loginParamsSchema,
  addStoreParamsSchema, addStoreResponseSchema,
  apiKeyAuthSchema,
  errorSchema
} from './schemas'
import { storePath } from './paths/store-path'

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
  tags: [
    { name: 'Signup' },
    { name: 'Login' },
    { name: 'Store' }
  ],
  paths: {
    '/signup': signupPath,
    '/login': loginPath,
    '/addStore': storePath
  },
  schemas: {
    signupParamsSchema,
    signupResponseSchema,
    loginParamsSchema,
    loginResponseSchema,
    addStoreParamsSchema,
    addStoreResponseSchema,
    apiKeyAuthSchema,
    errorSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    forbidden
  }
}
