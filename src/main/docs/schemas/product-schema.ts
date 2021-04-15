export const addProductParamsSchema = {
  type: 'object',
  properties: {
    description: { type: 'string' },
    details: { type: 'string' },
    trademark: { type: 'string' },
    reference: { type: 'string' },
    price: { type: 'number' }
  },
  required: ['description', 'trademark', 'reference']
}

export const addProductResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    description: { type: 'string' },
    details: { type: 'string' },
    trademark: { type: 'string' },
    reference: { type: 'string' },
    price: { type: 'number' },
    storeId: { type: 'string' }
  }
}

export const getProductsByStoreResponseSchema = {
  type: 'array',
  items: addProductResponseSchema
}
