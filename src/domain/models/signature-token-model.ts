export enum SignatureTypes {
  account = 'account'
}

export enum SignatureSubjectTypes {
  emailConfirmation = 'email confirmation'
}

export type SignatureTokenModel = {
  id: string
  token: string
  type: SignatureTypes
  subject?: string
  useDate: Date
}
