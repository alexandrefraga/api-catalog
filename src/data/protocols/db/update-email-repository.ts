export interface UpdateEmailRepository {
  updateEmail (email: string, isValid: boolean): Promise<boolean>
}
