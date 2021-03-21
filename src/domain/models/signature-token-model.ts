export enum SignatureTypes {
  account = 'account'
}

export type SignatureTokenModel = {
  id: string
  token: string
  type: SignatureTypes
  subject?: string
  useDate: Date
}
