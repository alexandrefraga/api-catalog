import { KeyRoute, Role, TypeKey } from '@/domain/models/account-model'

export const routeKeyStoreFactory = (role: Role, attribute: string = null): KeyRoute => ({
  typeKey: TypeKey.store,
  role,
  attribute,
  requiredStoreId: true
})
