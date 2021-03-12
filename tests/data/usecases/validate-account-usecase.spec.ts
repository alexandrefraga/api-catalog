import { ValidateAccountUseCase } from '@/data/usecases/validate-account-usecase'
import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '@/data/protocols/criptography'
import { UpdateEmailRepository, LoadAccountByTokenRepository } from '@/data/protocols/db'
import { mockDecrypter, mockLoadAccountByTokenRepository, mockUpdateEmailRepository } from '../../mocks'
import { mockAccountModel } from '../../mocks/mock-account'
import MockDate from 'mockdate'

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
  const sut = new ValidateAccountUseCase(jwtAdapterStub, loadAccountByTokenRepositoryStub, updateEmailRepositoryStub)
  return {
    sut,
    jwtAdapterStub,
    loadAccountByTokenRepositoryStub,
    updateEmailRepositoryStub
  }
}
describe('ValidateAccount Usecase', () => {
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

  test('Should ValidateAccountUseCase null if Decrypter throws', async () => {
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

  test('Should ValidateAccountUseCase throw if LoadAccountByTokenRepository throws', async () => {
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

  test('Should ValidateAccountUseCase throw if DdUpdateEmailRepository throws', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    jest.spyOn(updateEmailRepositoryStub, 'updateEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should ValidateAccountUseCase return false if UpdateEmailRepository return false', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    jest.spyOn(updateEmailRepositoryStub, 'updateEmail').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.validate('any_token')
    expect(response).toBe(false)
  })

  test('Should ValidateAccountUseCase return true if UpdateEmailRepository on success', async () => {
    const { sut } = makeSut()
    const response = await sut.validate('any_token')
    expect(response).toBe(true)
  })
})
