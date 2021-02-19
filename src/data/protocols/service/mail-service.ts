export type MailServiceParams = {
  address: string
  body: any
}

export interface MailService {
  send(data: MailServiceParams): Promise<void>
}
