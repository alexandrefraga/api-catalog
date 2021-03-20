type Template = {
  name: string
  props: {
    name?: string
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
