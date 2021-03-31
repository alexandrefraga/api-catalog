import { ValidateAccountUseCase } from '@/data/usecases/account/validate-account-usecase'
import { ValidateAccount } from '@/domain/usecases/account/validate-account'
import { Decrypter } from '@/data/protocols/criptography'
import { UpdateEmailRepository, LoadAccountByTokenRepository } from '@/data/protocols/db'
import { mockDecrypter, mockUpdateUsedSignatureByTokenRepository, mockLoadAccountByTokenRepository, mockUpdateEmailRepository } from '../../mocks'
import { mockAccountModel } from '../../mocks/mock-account'
import MockDate from 'mockdate'
import { UpdateUsedSignatureByTokenRepository } from '@/data/protocols/db/update-used-signature-by-token-repository'
import { SignatureTypes } from '@/domain/models/signature-token-model'

type SutTypes = {
  sut: ValidateAccount
  jwtAdapterStub: Decrypter
  updateUsedSignatureByTokenRepositoryStub: UpdateUsedSignatureByTokenRepository
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  updateEmailRepositoryStub: UpdateEmailRepository
}
const makeSut = (): SutTypes => {
  const jwtAdapterStub = mockDecrypter({ token: 'any_data', id: 'valid_id' })
  const updateUsedSignatureByTokenRepositoryStub = mockUpdateUsedSignatureByTokenRepository()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const updateEmailRepositoryStub = mockUpdateEmailRepository()
  const sut = new ValidateAccountUseCase(jwtAdapterStub, updateUsedSignatureByTokenRepositoryStub, updateEmailRepositoryStub)
  return {
    sut,
    jwtAdapterStub,
    updateUsedSignatureByTokenRepositoryStub,
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
    await sut.validate('any_token', SignatureTypes.account)
    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  test('Should ValidateAccountUseCase null if Decrypter throws', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    jest.spyOn(jwtAdapterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.validate('any_token', SignatureTypes.account)
    expect(response).toBeNull()
  })

  test('Should call UpdateUsedSignatureByTokenRepository with correct token', async () => {
    const { sut, updateUsedSignatureByTokenRepositoryStub } = makeSut()
    const updateUsedSpy = jest.spyOn(updateUsedSignatureByTokenRepositoryStub, 'updateUsed')
    await sut.validate('any_token', SignatureTypes.account)
    expect(updateUsedSpy).toHaveBeenCalledWith('any_token', SignatureTypes.account)
  })

  test('Should ValidateAccountUseCase returns null if UpdateUsedSignatureByTokenRepository false', async () => {
    const { sut, updateUsedSignatureByTokenRepositoryStub } = makeSut()
    jest.spyOn(updateUsedSignatureByTokenRepositoryStub, 'updateUsed').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.validate('any_token', SignatureTypes.account)
    expect(response).toBeNull()
  })

  test('Should ValidateAccountUseCase throw if UpdateUsedSignatureByTokenRepository throws', async () => {
    const { sut, updateUsedSignatureByTokenRepositoryStub } = makeSut()
    jest.spyOn(updateUsedSignatureByTokenRepositoryStub, 'updateUsed').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token', SignatureTypes.account)
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateEmailRepository with correct values', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    const updateEmailSpy = jest.spyOn(updateEmailRepositoryStub, 'updateEmail')
    await sut.validate('any_token', SignatureTypes.account)
    const account = mockAccountModel()
    expect(updateEmailSpy).toHaveBeenCalledWith(account.id, new Date())
  })

  test('Should ValidateAccountUseCase throw if UpdateEmailRepository throws', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    jest.spyOn(updateEmailRepositoryStub, 'updateEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token', SignatureTypes.account)
    await expect(promise).rejects.toThrow()
  })

  test('Should ValidateAccountUseCase return false if UpdateEmailRepository return false', async () => {
    const { sut, updateEmailRepositoryStub } = makeSut()
    jest.spyOn(updateEmailRepositoryStub, 'updateEmail').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.validate('any_token', SignatureTypes.account)
    expect(response).toBe(false)
  })

  test('Should ValidateAccountUseCase return true if UpdateEmailRepository on success', async () => {
    const { sut } = makeSut()
    const response = await sut.validate('any_token', SignatureTypes.account)
    expect(response).toBe(true)
  })
})
