import { MailService } from '@/data/protocols/service/mail-service'
import { NodemailerAdapter } from '@/infra/service/nodemailer-adapter'
import fs from 'fs'
import { mockMailServiceParams } from '../../data/mocks'
import env from '@/main/config/env'

type SutTypes = {
  sut: MailService
}
const makeSut = (): SutTypes => {
  const sut = new NodemailerAdapter(env.mailParams, env.mailFrom, env.baseUrl)
  return {
    sut
  }
}
describe('Nodemailer Adapter', () => {
  test('Should throw if fs throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.send(mockMailServiceParams())
    await expect(promise).rejects.toThrowError()
  })
})
