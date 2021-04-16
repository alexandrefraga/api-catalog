import { signupPath, loginPath, storePath, productPath, productsByStorePath } from './paths'
import { badRequest, serverError, unauthorized, forbidden } from './components'
import {
  signupParamsSchema, signupResponseSchema,
  loginResponseSchema, loginParamsSchema,
  addStoreParamsSchema, addStoreResponseSchema,
  addProductParamsSchema, addProductResponseSchema, getProductsByStoreResponseSchema,
  apiKeyAuthSchema,
  errorSchema
} from './schemas'

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
    { name: 'Account' },
    { name: 'Store' },
    { name: 'Product' }
  ],
  paths: {
    '/signup': signupPath,
    '/login': loginPath,
    '/store': storePath,
    '/product/{storeId}': productPath,
    '/products/{storeId}': productsByStorePath
  },
  schemas: {
    signupParamsSchema,
    signupResponseSchema,
    loginParamsSchema,
    loginResponseSchema,
    addStoreParamsSchema,
    addStoreResponseSchema,
    addProductParamsSchema,
    addProductResponseSchema,
    getProductsByStoreResponseSchema,
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
