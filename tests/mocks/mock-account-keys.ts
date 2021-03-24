import { Key, KeyParams, KeyRoute, Role } from '@/domain/models/account-model'

export const makeKeyAdmin = (): Key => ({
  typeKey: 'app',
  role: Role.systemAdmin,
  storeId: [],
  attributes: []
})

export const makeKeyRouteAdmin = (): KeyRoute => ({
  typeKey: 'app',
  role: Role.systemAdmin,
  requiredStoreId: false,
  attribute: null
})

export const makeKeyParamsAdmin = (): KeyParams => ({
  typeKey: 'app',
  role: Role.systemAdmin,
  storeId: null,
  attribute: null
})

export const makeKeyOperator = (): Key => ({
  typeKey: 'app',
  role: Role.systemOperator,
  storeId: [],
  attributes: ['any']
})

export const makeKeyParamsOperator = (): KeyParams => ({
  typeKey: 'app',
  role: Role.systemOperator,
  storeId: null,
  attribute: 'any'
})

export const makeKeyAdminStore = (): Key => ({
  typeKey: 'store',
  role: Role.storeAdmin,
  storeId: ['store_id'],
  attributes: []
})

export const makeKeyParamsAdminStore = (): KeyParams => ({
  typeKey: 'store',
  role: Role.storeAdmin,
  storeId: 'store_id',
  attribute: 'any'
})

export const makeKeyRouteAdminStore = (): KeyRoute => ({
  typeKey: 'store',
  role: Role.storeAdmin,
  requiredStoreId: true,
  attribute: 'any'
})

export const makeKeyOperatorStore = (): Key => ({
  typeKey: 'store',
  role: Role.storeOperator,
  storeId: ['store_id'],
  attributes: ['any']
})

export const makeKeyParamsOperatorStore = (): KeyParams => ({
  typeKey: 'store',
  role: Role.storeOperator,
  storeId: 'store_id',
  attribute: 'any'
})

export const makeKeyParamsStoreError = (): KeyParams => ({
  typeKey: 'store',
  role: Role.storeOperator,
  attribute: 'any'
})
