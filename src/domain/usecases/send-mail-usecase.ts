export type SendMailParams = {
  subject: string
  name: string
  email: string
  token: string
}

export interface SendMail {
  send (data: SendMailParams): Promise<void>
}
