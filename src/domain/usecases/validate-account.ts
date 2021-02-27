export interface ValidateAccount {
  validate (token: string): Promise<boolean>
}
