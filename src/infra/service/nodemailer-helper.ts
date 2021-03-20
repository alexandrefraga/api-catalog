import { MailServiceParams } from '@/data/protocols/service'
import { SendMailParams } from '@/domain/usecases/send-mail-usecase'

export function nodemailerAdaptSendParams (data: SendMailParams, template: string): MailServiceParams {
  const { subject, name, email, token } = data
  return {
    mailTo: `${name}<${email}>`,
    subject,
    template: {
      name: template,
      props: {
        name,
        token
      }
    }
  }
}
