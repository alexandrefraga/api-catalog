import { Key, KeyParams, KeyRoute, Role, TypeKey } from '@/domain/models/account-model'

export const makeKeyAdmin = (): Key => ({
  id: Date.now(),
  typeKey: TypeKey.app,
  role: Role.systemAdmin,
  storeId: null,
  attributes: []
})

export const makeKeyRouteAdmin = (): KeyRoute => ({
  typeKey: TypeKey.app,
  role: Role.systemAdmin,
  requiredStoreId: false,
  attribute: null
})

export const makeKeyParamsAdmin = (): KeyParams => ({
  typeKey: TypeKey.app,
  role: Role.systemAdmin,
  storeId: null,
  attribute: null
})

export const makeKeyOperator = (): Key => ({
  id: Date.now(),
  typeKey: TypeKey.app,
  role: Role.systemOperator,
  storeId: null,
  attributes: ['any']
})

export const makeKeyParamsOperator = (): KeyParams => ({
  typeKey: TypeKey.app,
  role: Role.systemOperator,
  storeId: null,
  attribute: 'any'
})

export const makeKeyRouteOperator = (): KeyRoute => ({
  typeKey: TypeKey.app,
  role: Role.systemOperator,
  requiredStoreId: false,
  attribute: 'any'
})

export const makeKeyAdminStore = (): Key => ({
  id: Date.now(),
  typeKey: TypeKey.store,
  role: Role.storeAdmin,
  storeId: 'store_id',
  attributes: []
})

export const makeKeyParamsAdminStore = (): KeyParams => ({
  typeKey: TypeKey.store,
  role: Role.storeAdmin,
  storeId: 'store_id',
  attribute: 'any'
})

export const makeKeyRouteAdminStore = (): KeyRoute => ({
  typeKey: TypeKey.store,
  role: Role.storeAdmin,
  requiredStoreId: true,
  attribute: 'any'
})

export const makeKeyOperatorStore = (storeId: string = 'store_id'): Key => ({
  id: Date.now(),
  typeKey: TypeKey.store,
  role: Role.storeOperator,
  storeId,
  attributes: ['any']
})

export const makeKeyParamsOperatorStore = (): KeyParams => ({
  typeKey: TypeKey.store,
  role: Role.storeOperator,
  storeId: 'store_id',
  attribute: 'any'
})

export const makeKeyRouteOperatorStore = (): KeyRoute => ({
  typeKey: TypeKey.store,
  role: Role.storeOperator,
  requiredStoreId: true,
  attribute: 'any'
})

export const makeKeyParamsStoreError = (): KeyParams => ({
  typeKey: TypeKey.store,
  role: Role.storeOperator,
  attribute: 'any'
})
