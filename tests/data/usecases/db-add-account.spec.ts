import { DbAddAccount } from '@/data/usecases/db-add-account'
import { Encrypter, Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository, mockMailService, mockEncrypter, mockMailServiceParams } from '../mocks'
import { mockAccountModel, mockAddAccountParams } from '../../domain/mocks/mock-account'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-repository'
import { MailService } from '../protocols/service/mail-service'

const addAccountParams = mockAddAccountParams()

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailStub: LoadAccountByEmailRepository
  encrypterStub: Encrypter
  mailServiceStub: MailService
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailStub = mockLoadAccountByEmailRepository()
  const encrypterStub = mockEncrypter()
  const mailServiceStub = mockMailService()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailStub, encrypterStub, mailServiceStub, 'mail')
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub,
    encrypterStub,
    mailServiceStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    const hashSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    await sut.add(addAccountParams)
    expect(hashSpy).toBeCalledWith(addAccountParams.email)
  })

  test('Should return null if LoadAccountByEmail return an account', async () => {
    const { sut } = makeSut()
    const account = await sut.add(addAccountParams)
    expect(account).toBeNull()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(addAccountParams)
    expect(hashSpy).toBeCalledWith(addAccountParams.password)
  })

  test('Should DbAddAccount throw if Hasher throws', async () => {
    const { sut, hasherStub, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(addAccountParams)
    expect(addSpy).toBeCalledWith(Object.assign(addAccountParams, { password: 'hashed_value' }))
  })

  test('Should DbAddAccount throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should DbAddAccount return an account on success', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(addAccountParams)
    expect(response).toEqual(mockAccountModel())
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, loadAccountByEmailStub, encrypterStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.add(addAccountParams)
    const encryptParam = JSON.stringify({ id: account.id })
    expect(encryptSpy).toHaveBeenCalledWith(encryptParam)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, loadAccountByEmailStub, encrypterStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should call MailService with correct values', async () => {
    const { sut, loadAccountByEmailStub, mailServiceStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const sendSpy = jest.spyOn(mailServiceStub, 'send')
    await sut.add(addAccountParams)
    expect(sendSpy).toBeCalledWith(mockMailServiceParams())
  })

  test('Should DbAddAccount throw if MailService throws', async () => {
    const { sut, mailServiceStub, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(mailServiceStub, 'send').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })
})
