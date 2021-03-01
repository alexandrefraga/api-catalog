import { DbValidateAccount } from '@/data/usecases/db-validate-account'
import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { mockDecrypter, mockUpdateEmailRepository } from '../mocks'
import { UpdateEmailRepository } from '../protocols/db/update-email-repository'

type SutTypes = {
  sut: ValidateAccount
  jwtAdapterStub: Decrypter
  dbUpdateEmailRepositoryStub: UpdateEmailRepository
}
const makeSut = (): SutTypes => {
  const jwtAdapterStub = mockDecrypter({ email: 'any_email' })
  const dbUpdateEmailRepositoryStub = mockUpdateEmailRepository()
  const sut = new DbValidateAccount(jwtAdapterStub, dbUpdateEmailRepositoryStub)
  return {
    sut,
    jwtAdapterStub,
    dbUpdateEmailRepositoryStub
  }
}
describe('DbValidateAccount', () => {
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
    jest.spyOn(jwtAdapterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({ field: 'any' }))
    const response = await sut.validate('any_token')
    expect(response).toBeNull()
  })

  test('Should call DdUpdateEmailRepository with correct values', async () => {
    const { sut, dbUpdateEmailRepositoryStub } = makeSut()
    const updateEmailSpy = jest.spyOn(dbUpdateEmailRepositoryStub, 'updateEmail')
    await sut.validate('any_token')
    expect(updateEmailSpy).toHaveBeenCalledWith('any_email', true)
  })

  test('Should DbValidateAccount throw if DdUpdateEmailRepository throws', async () => {
    const { sut, dbUpdateEmailRepositoryStub } = makeSut()
    jest.spyOn(dbUpdateEmailRepositoryStub, 'updateEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })
})