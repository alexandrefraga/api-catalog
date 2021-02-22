import { MailService, MailServiceParams } from '@/data/protocols/service/mail-service'
import nodemailer from 'nodemailer'
// import hbs from 'nodemailer-express-handlebars'
// import exphbs from 'express-handlebars'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

export class NodemailerAdapter implements MailService {
  async send (data: MailServiceParams): Promise<void> {
    const filePath = path.join(__dirname, '../../template/mail.html')
    const source = fs.readFileSync(filePath, 'utf-8').toString()
    const template = handlebars.compile(source)
    const replacements = {
      token: data.body.token
    }
    console.log(replacements)
    const htmlToSend = template(replacements)
    console.log(htmlToSend)
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '664be95f8e43a4',
        pass: 'caa9298ef4684e'
      }
    })
    await transport.sendMail({
      to: data.address,
      from: 'alexandrenfraga@yahoo.com.br',
      html: htmlToSend,
      subject: 'primeira mensagem'
    }, (error) => {
      if (error) {
        console.log(error)
      }
    })
  }
}
