export enum Role {
  systemAdmin = 'system administrator',
  systemOperator = 'system operator',
  storeAdmin = 'store administrator',
  storeOperator = 'store operator'
}

export type Key = {
  typeKey: string
  role: Role
  storeId: string[]
  attributes: string[]
}

export type KeyRoute = {
  typeKey: string
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
  role?: Role
  keys?: Key[]
}
