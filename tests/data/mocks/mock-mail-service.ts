import { MailService, MailServiceParams } from '@/data/protocols/service/mail-service'

export const mockMailService = (): MailService => {
  class MailServiceStub implements MailService {
    async send (data: MailServiceParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new MailServiceStub()
}
