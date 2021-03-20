import { SendMailParams } from '@/domain/usecases/send-mail-usecase'

export const mockSendMailParams = (): SendMailParams => ({
  subject: 'any_subject',
  name: 'any_name',
  email: 'any_email@mail.com',
  token: 'any_token'
})
