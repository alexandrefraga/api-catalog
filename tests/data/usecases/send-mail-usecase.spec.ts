import { SendMail } from '@/domain/usecases/send-mail-usecase'
import { MailService } from '@/data/protocols/service'
import { SendMailUseCase } from '@/data/usecases/send-mail-usecase'
import { mockMailService } from '../../mocks'
import { mockSendMailParams } from '../../mocks/mock-send-mail'
import { nodemailerAdaptSendParams } from '@/infra/service/nodemailer-helper'

const sendMailParams = mockSendMailParams()
const mailTemplate = 'mail'

type SutTypes = {
  sut: SendMail
  mailServiceStub: MailService
}
const makeSut = (): SutTypes => {
  const mailServiceStub = mockMailService()
  const sut = new SendMailUseCase(mailServiceStub, mailTemplate, nodemailerAdaptSendParams)
  return {
    sut,
    mailServiceStub
  }
}
describe('SendMail Usecase', () => {
  test('Should call MailService with correct values', async () => {
    const { sut, mailServiceStub } = makeSut()
    const sendSpy = jest.spyOn(mailServiceStub, 'send')
    await sut.send(sendMailParams)
    expect(sendSpy).toBeCalledWith(nodemailerAdaptSendParams(sendMailParams, mailTemplate))
  })

  test('Should DbAddAccount throw if MailService throws', async () => {
    const { sut, mailServiceStub } = makeSut()
    jest.spyOn(mailServiceStub, 'send').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.send(sendMailParams)
    await expect(promise).rejects.toThrow()
  })
})
