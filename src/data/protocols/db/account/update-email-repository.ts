export interface UpdateEmailRepository {
  updateEmail (id: string, confirmation: Date, email?: string): Promise<boolean>
}
