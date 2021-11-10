import { SendMail, SendMailParams } from '@/domain/usecases/send-mail-usecase'
import { MailService } from '../protocols/service'

export class SendMailUseCase implements SendMail {
  constructor (
    private readonly mailService: MailService,
    private readonly mailTemplate: string,
    private readonly adaptParams: Function
  ) {}

  async send (data: SendMailParams): Promise<void> {
    await this.mailService.send(this.adaptParams({ ...data }, this.mailTemplate))
  }
}
