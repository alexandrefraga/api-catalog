import { Key, KeyRoute, Role } from '@/domain/models/account-model'

export const makeKeyAdmin = (): Key => ({
  typeKey: 'app',
  role: Role.systemAdmin,
  storeId: [],
  attributes: []
})

export const makeKeyRouteAdmin = (): KeyRoute => ({
  typeKey: 'app',
  role: Role.systemAdmin,
  attribute: ''
})

export const makeKeyOperator = (): Key => ({
  typeKey: 'app',
  role: Role.systemOperator,
  storeId: [],
  attributes: ['any']
})

export const makeKeyRouteOperator = (): KeyRoute => ({
  typeKey: 'app',
  role: Role.systemOperator,
  attribute: 'any'
})

export const makeKeyAdminStore = (): Key => ({
  typeKey: 'store',
  role: Role.storeAdmin,
  storeId: ['store_id'],
  attributes: []
})

export const makeKeyRouteAdminStore = (): KeyRoute => ({
  typeKey: 'store',
  role: Role.storeAdmin,
  storeId: 'store_id',
  attribute: 'any'
})

export const makeKeyOperatorStore = (): Key => ({
  typeKey: 'store',
  role: Role.storeOperator,
  storeId: ['store_id'],
  attributes: ['any']
})

export const makeKeyRouteOperatorStore = (): KeyRoute => ({
  typeKey: 'store',
  role: Role.storeOperator,
  storeId: 'store_id',
  attribute: 'any'
})

export const makeKeyRouteStoreError = (): KeyRoute => ({
  typeKey: 'store',
  role: Role.storeOperator,
  attribute: 'any'
})
