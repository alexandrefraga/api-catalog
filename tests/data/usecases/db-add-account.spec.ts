import { DbAddAccount } from '@/data/usecases/db-add-account'
import { Encrypter, Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository, UpdateTokenRepository } from '@/data/protocols/db'
import { MailService } from '@/data/protocols/service/mail-service'
import { mockAccountModel, mockAddAccountParams } from '../../domain/mocks/mock-account'
import { mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository, mockMailService, mockEncrypter, mockMailServiceParams, mockUpdateTokenRepository } from '../mocks'

const addAccountParams = mockAddAccountParams()
type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailStub: LoadAccountByEmailRepository
  encrypterStub: Encrypter
  updateTokenRepositoryStub: UpdateTokenRepository
  mailServiceStub: MailService
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValue(Promise.resolve(null))
  const encrypterStub = mockEncrypter()
  const updateTokenRepositoryStub = mockUpdateTokenRepository()
  const mailServiceStub = mockMailService()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub,
    encrypterStub,
    updateTokenRepositoryStub,
    mailServiceStub,
    'mail'
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub,
    encrypterStub,
    updateTokenRepositoryStub,
    mailServiceStub
  }
}
describe('DbAddAccount Usecase', () => {
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

  test('Should DbAddAccount throw if Hasher throws', async () => {
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

  test('Should DbAddAccount throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should DbAddAccount return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(addAccountParams)
    expect(response).toEqual(mockAccountModel())
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.add(addAccountParams)
    const encryptParam = JSON.stringify({ id: account.id })
    expect(encryptSpy).toHaveBeenCalledWith(encryptParam)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateTokenRepository with correct values ', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    const updateTokenSpy = jest.spyOn(updateTokenRepositoryStub, 'updateToken')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.add(addAccountParams)
    expect(updateTokenSpy).toHaveBeenCalledWith(await mockEncrypter().encrypt(''), account.id)
  })

  test('Should throw if UpdateTokenRepository throws', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateTokenRepository return false', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockReturnValueOnce(Promise.resolve(false))
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
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
