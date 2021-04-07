import { MailService, MailServiceParams } from '@/data/protocols/service/mail-service'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export class NodemailerAdapter implements MailService {
  constructor (
    private readonly transportOptions: string | SMTPTransport | SMTPTransport.Options,
    private readonly mailFrom: string,
    private readonly baseUrl: string
  ) {}

  async send (data: MailServiceParams): Promise<void> {
    const filePath = path.join(__dirname, `../../template/${data.template.name}.html`)
    const source = fs.readFileSync(filePath, 'utf-8').toString()
    const template = handlebars.compile(source)
    const replacements = {
      name: data.template.props.name,
      token: data.template.props.token,
      baseUrl: this.baseUrl
    }
    const htmlToSend = template(replacements)
    const transport = nodemailer.createTransport(this.transportOptions)
    await transport.sendMail({
      to: data.mailTo,
      from: this.mailFrom,
      html: htmlToSend,
      subject: data.subject
    })
  }
}
