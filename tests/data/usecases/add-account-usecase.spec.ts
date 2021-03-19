import { AddAccountUseCase } from '@/data/usecases/add-account-usecase'
import { Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db'
import { MailService } from '@/data/protocols/service/mail-service'
import { mockAccountModel, mockAddAccountParams } from '../../mocks/mock-account'
import { mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository, mockMailService, mockMailServiceParams } from '../../mocks'

const addAccountParams = mockAddAccountParams()
type SutTypes = {
  sut: AddAccountUseCase
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailStub: LoadAccountByEmailRepository
  mailServiceStub: MailService
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValue(Promise.resolve(null))
  const mailServiceStub = mockMailService()
  const sut = new AddAccountUseCase(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub,
    mailServiceStub,
    'mail'
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub,
    mailServiceStub
  }
}
describe('AddAccount Usecase', () => {
  test('Should call LoadAccountByEmail only with the correct email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    const hashSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    await sut.add(addAccountParams)
    expect(hashSpy).toBeCalledWith(addAccountParams.email)
  })

  test('Should return null if LoadAccountByEmail return an account', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(addAccountParams)
    expect(account).toBeNull()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(addAccountParams)
    expect(hashSpy).toBeCalledWith(addAccountParams.password)
  })

  test('Should AddAccountUseCase throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(addAccountParams)
    expect(addSpy).toBeCalledWith(Object.assign(addAccountParams, { password: 'hashed_value' }))
  })

  test('Should AddAccountUseCase throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should AddAccountUseCase return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(addAccountParams)
    expect(response).toEqual(mockAccountModel())
  })

  test('Should call MailService with correct values', async () => {
    const { sut, mailServiceStub } = makeSut()
    const sendSpy = jest.spyOn(mailServiceStub, 'send')
    await sut.add(addAccountParams)
    expect(sendSpy).toBeCalledWith(mockMailServiceParams())
  })

  test('Should DbAddAccount throw if MailService throws', async () => {
    const { sut, mailServiceStub } = makeSut()
    jest.spyOn(mailServiceStub, 'send').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })
})
