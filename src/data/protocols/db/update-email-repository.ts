export interface UpdateEmailRepository {
  updateEmail (id: string, email: string, isValid: boolean): Promise<boolean>
}
