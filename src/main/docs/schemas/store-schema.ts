export const addStoreParamsSchema = {
  type: 'object',
  properties: {
    company: { type: 'string' },
    tradingName: { type: 'string' },
    description: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string', required: true },
        number: { type: 'string', required: true },
        city: { type: 'string', required: true }
      }
    },
    email: { type: 'string' },
    phoneNumber: {
      type: 'array',
      items: {
        type: 'string',
        required: true,
        pattern: '\\d{2}-\\d{8,9}$'
      }
    },
    geoLocalization: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' }
      }
    }
  },
  required: ['company', 'tradingName', 'description', 'address', 'email', 'phoneNumber', 'geoLocalization']
}

export const addStoreResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    company: { type: 'string' },
    tradingName: { type: 'string' },
    description: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        number: { type: 'string' },
        city: { type: 'string' }
      }
    },
    email: { type: 'string' },
    phoneNumber: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    geoLocalization: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' }
      }
    }
  }
}
