export interface UpdateEmailRepository {
  updateEmail (id: string, email: string, confirmation: Date): Promise<boolean>
}
