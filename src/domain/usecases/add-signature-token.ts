export interface AddSignatureToken {
  add(data: { id: string }): Promise<{ token: string}>
}
