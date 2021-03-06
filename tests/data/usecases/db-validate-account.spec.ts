import { DbValidateAccount } from '@/data/usecases/db-validate-account'
import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { mockDecrypter, mockUpdateEmailRepository } from '../mocks'
import { UpdateEmailRepository } from '../protocols/db/update-email-repository'
import MockDate from 'mockdate'

type SutTypes = {
  sut: ValidateAccount
  jwtAdapterStub: Decrypter
  dbUpdateEmailRepositoryStub: UpdateEmailRepository
}
const makeSut = (): SutTypes => {
  const jwtAdapterStub = mockDecrypter({ id: 'any_id', email: 'any_email' })
  const dbUpdateEmailRepositoryStub = mockUpdateEmailRepository()
  const sut = new DbValidateAccount(jwtAdapterStub, dbUpdateEmailRepositoryStub)
  return {
    sut,
    jwtAdapterStub,
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

  test('Should DbValidateAccount null if Decrypter null', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    jest.spyOn(jwtAdapterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.validate('any_token')
    expect(response).toBeNull()
  })

  test('Should DbValidateAccount return null if token does not contain email', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    jest.spyOn(jwtAdapterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({ id: 'any_id' }))
    const response = await sut.validate('any_token')
    expect(response).toBeNull()
  })

  test('Should DbValidateAccount return null if token does not contain id', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    jest.spyOn(jwtAdapterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({ email: 'any_email' }))
    const response = await sut.validate('any_token')
    expect(response).toBeNull()
  })

  test('Should call DdUpdateEmailRepository with correct values', async () => {
    const { sut, dbUpdateEmailRepositoryStub } = makeSut()
    const updateEmailSpy = jest.spyOn(dbUpdateEmailRepositoryStub, 'updateEmail')
    await sut.validate('any_token')
    expect(updateEmailSpy).toHaveBeenCalledWith('any_id', 'any_email', new Date())
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
