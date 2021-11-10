export type AddAccountParams = {
  name: string
  email: string
  password: string
}

export type User = { id: string, name: string, email: string }

export interface AddAccount {
  add (account: AddAccountParams): Promise<User>
}
