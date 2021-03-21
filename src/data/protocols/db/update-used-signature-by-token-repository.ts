export interface UpdateUsedSignatureByTokenRepository {
  updateUsed (token: string): Promise<boolean>
}
