import { MailService } from '@/data/protocols/service/mail-service'
import { NodemailerAdapter } from '@/infra/service/nodemailer-adapter'
import fs from 'fs'
import { mockMailServiceParams } from '../../data/mocks'

jest.mock('fs', () => ({
  readFileSync (path: string, encoding: string): string {
    return 'any_template'
  }
}))

type SutTypes = {
  sut: MailService
}
const makeSut = (): SutTypes => {
  const sut = new NodemailerAdapter()
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
