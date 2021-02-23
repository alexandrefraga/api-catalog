import { AccountModel } from '@/domain/models/account-model'

type Template = {
  name: string
  props: {
    account?: AccountModel
    token?: string
  }
}

export type MailServiceParams = {
  mailTo: string
  subject: string
  template: Template
}

export interface MailService {
  send(data: MailServiceParams): Promise<void>
}
