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
  dbUpdateEmailRepositoryStub: UpdateEmailRepository
}
const makeSut = (): SutTypes => {
  const jwtAdapterStub = mockDecrypter('any_data')
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const dbUpdateEmailRepositoryStub = mockUpdateEmailRepository()
  const sut = new DbValidateAccount(jwtAdapterStub, loadAccountByTokenRepositoryStub, dbUpdateEmailRepositoryStub)
  return {
    sut,
    jwtAdapterStub,
    loadAccountByTokenRepositoryStub,
    dbUpdateEmailRepositoryStub
  }
}
describe('DbValidateAccount', () => {
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

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.validate('any_token')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should call DdUpdateEmailRepository with correct values', async () => {
    const { sut, dbUpdateEmailRepositoryStub } = makeSut()
    const updateEmailSpy = jest.spyOn(dbUpdateEmailRepositoryStub, 'updateEmail')
    await sut.validate('any_token')
    const account = mockAccountModel()
    expect(updateEmailSpy).toHaveBeenCalledWith(account.id, account.email, new Date())
  })

  test('Should DbValidateAccount throw if DdUpdateEmailRepository throws', async () => {
    const { sut, dbUpdateEmailRepositoryStub } = makeSut()
    jest.spyOn(dbUpdateEmailRepositoryStub, 'updateEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should DbValidateAccount return false if DdUpdateEmailRepository return false', async () => {
    const { sut, dbUpdateEmailRepositoryStub } = makeSut()
    jest.spyOn(dbUpdateEmailRepositoryStub, 'updateEmail').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.validate('any_token')
    expect(response).toBe(false)
  })

  test('Should DbValidateAccount return true if DdUpdateEmailRepository on success', async () => {
    const { sut } = makeSut()
    const response = await sut.validate('any_token')
    expect(response).toBe(true)
  })
})
