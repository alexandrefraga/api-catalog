import { SendMail, SendMailParams } from '@/domain/usecases/send-mail-usecase'

export const mockSendMailUsecase = (): SendMail => {
  class SendMailStub implements SendMail {
    async send (data: SendMailParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new SendMailStub()
}
