import { MailService, MailServiceParams } from '@/data/protocols/service/mail-service'
import { mockAccountModel } from './mock-account'

export const mockMailService = (): MailService => {
  class MailServiceStub implements MailService {
    async send (data: MailServiceParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new MailServiceStub()
}

export const mockMailServiceParams = (): MailServiceParams => ({
  mailTo: `${mockAccountModel().name}<${mockAccountModel().email}>`,
  subject: `Account confirmation to ${mockAccountModel().name}`,
  template: {
    name: 'mail',
    props: {
      name: mockAccountModel().name,
      token: 'encrypted_value'
    }
  }
})
