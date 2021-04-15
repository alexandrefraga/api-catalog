export const storePath = {
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Store'],
    summary: 'Api para criar uma loja',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addStoreParamsSchema'
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
              $ref: '#/schemas/addStoreResponseSchema'
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
