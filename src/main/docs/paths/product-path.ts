export const productPath = {
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Product'],
    summary: 'Api para criar um produto',
    parameters: [{
      in: 'path',
      name: 'storeId',
      required: true,
      schema: { type: 'string' }
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addProductParamsSchema'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/addProductResponseSchema'
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
