import { DbValidateAccount } from '@/data/usecases/db-validate-account'
import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { mockDecrypter, mockLoadAccountByTokenRepository, mockUpdateEmailRepository } from '../mocks'
import { UpdateEmailRepository } from '../protocols/db/update-email-repository'
import MockDate from 'mockdate'
import { LoadAccountByTokenRepository } from '../protocols/db/load-account-repository'
import { mockAccountModel } from '../../domain/mocks/mock-account'

type SutTypes = {
  sut: ValidateAccount
  jwtAdapterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  updateEmailRepositoryStub: UpdateEmailRepository
}
const makeSut = (): SutTypes => {
  const jwtAdapterStub = mockDecrypter('any_data')
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const updateEmailRepositoryStub = mockUpdateEmailRepository()
  const sut = new DbValidateAccount(jwtAdapterStub, loadAccountByTokenRepositoryStub, updateEmailRepositoryStub)
  return {
    sut,
    jwtAdapterStub,
    loadAccountByTokenRepositoryStub,
    updateEmailRepositoryStub
  }
}
describe('DbValidateAccount Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  test('Should call Decrypter with correct token', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    const verifySpy = jest.spyOn(jwtAdapterStub, 'decrypt')
    await sut.validate('any_token')
    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  test('Should DbValidateAccount null if Decrypter throws', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    jest.spyOn(jwtAdapterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.validate('any_token')
    expect(response).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct token', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.validate('any_token')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should DbValidateAccount throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should call DdUpdateEmailRepository with correct values', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    const updateEmailSpy = jest.spyOn(updateEmailRepositoryStub, 'updateEmail')
    await sut.validate('any_token')
    const account = mockAccountModel()
    expect(updateEmailSpy).toHaveBeenCalledWith(account.id, account.email, new Date())
  })

  test('Should DbValidateAccount throw if DdUpdateEmailRepository throws', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    jest.spyOn(updateEmailRepositoryStub, 'updateEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should DbValidateAccount return false if UpdateEmailRepository return false', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    jest.spyOn(updateEmailRepositoryStub, 'updateEmail').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.validate('any_token')
    expect(response).toBe(false)
  })

  test('Should DbValidateAccount return true if UpdateEmailRepository on success', async () => {
    const { sut } = makeSut()
    const response = await sut.validate('any_token')
    expect(response).toBe(true)
  })
})
