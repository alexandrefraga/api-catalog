export enum Role {
  systemAdmin = 'system administrator',
  systemOperator = 'system operator'
}

export type Key = {
  typeKey: string
  storeId: string
  attributes: string[]
}

export type AccountModel = {
  id: string
  name: string
  email: string
  emailConfirmation?: Date
  password: string
  role?: Role
  keys?: Key[]
}
