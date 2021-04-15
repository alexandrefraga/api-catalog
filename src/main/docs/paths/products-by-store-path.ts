export const productsByStorePath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Product'],
    summary: 'Api para buscar os produtos de uma loja',
    parameters: [{
      in: 'path',
      name: 'storeId',
      required: true,
      schema: { type: 'string' }
    }],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/getProductsByStoreResponseSchema'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
