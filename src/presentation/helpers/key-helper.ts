import { Key, Role, TypeKey } from '@/domain/models/account-model'

export const storeKey = (storeId: string, role: Role, attributes: string[] = []): Key => {
  return {
    id: Date.now(),
    typeKey: TypeKey.store,
    role,
    storeId,
    attributes
  }
}
