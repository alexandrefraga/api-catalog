export interface UpdateTokenRepository {
  updateToken (token: string, id: string): Promise<void>
}
