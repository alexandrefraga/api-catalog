import { LoadAccountByTokenUseCase } from '@/data/usecases/load-account-by-token-usecase'
import { Role } from '@/domain/models/account-model'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { mockAccountModel, mockDecrypter, mockLoadAccountByTokenRepository } from '../../mocks'
import { Decrypter } from '../protocols/criptography'
import { LoadAccountByTokenRepository } from '../protocols/db'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}
const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter('any_value')
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new LoadAccountByTokenUseCase(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}
describe('LoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', Role.systemAdmin)
    expect(loadSpy).toHaveBeenCalledWith('any_token', Role.systemAdmin)
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token', Role.systemAdmin)
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token')
    expect(account).toEqual(mockAccountModel())
  })
})
