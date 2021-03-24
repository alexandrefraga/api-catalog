import { LoadAccountByTokenUseCase } from '@/data/usecases/load-account-by-token-usecase'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { makeKeyParamsOperatorStore, mockAccountModel, mockDecrypter, mockLoadAccountByKeyRepository } from '../../mocks'
import { Decrypter } from '../protocols/criptography'
import { LoadAccountByKeyRepository } from '../protocols/db'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByKeyRepositoryStub: LoadAccountByKeyRepository
}
const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter('any_value')
  const loadAccountByKeyRepositoryStub = mockLoadAccountByKeyRepository()
  const sut = new LoadAccountByTokenUseCase(decrypterStub, loadAccountByKeyRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByKeyRepositoryStub
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
    const { sut, loadAccountByKeyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByKeyRepositoryStub, 'loadByKey')
    await sut.load('any_token', makeKeyParamsOperatorStore())
    expect(loadSpy).toHaveBeenCalledWith('any_token', makeKeyParamsOperatorStore())
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByKeyRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByKeyRepositoryStub, 'loadByKey').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token', makeKeyParamsOperatorStore())
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByKeyRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByKeyRepositoryStub, 'loadByKey').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token')
    expect(account).toEqual(mockAccountModel())
  })
})
