export interface ValidateAccount {
  validate (data: { signature: string }): Promise<boolean>
}
