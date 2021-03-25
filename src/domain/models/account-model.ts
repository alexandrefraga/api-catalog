export enum Role {
  systemAdmin = 'system administrator',
  systemOperator = 'system operator',
  storeAdmin = 'store administrator',
  storeOperator = 'store operator'
}

export enum TypeKey {
  app = 'app',
  store = 'store'
}

export type Key = {
  typeKey: TypeKey
  role: Role
  storeId: string[]
  attributes: string[]
}

export type KeyRoute = {
  typeKey: TypeKey
  role: Role
  attribute: string
  requiredStoreId: boolean
}

export type KeyParams = {
  typeKey: TypeKey
  role: Role
  attribute: string
  storeId?: string
}

export type AccountModel = {
  id: string
  name: string
  email: string
  emailConfirmation?: Date
  password: string
  token?: string
  keys?: Key[]
}
