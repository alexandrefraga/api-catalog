import { LoadAccountByTokenUseCase } from '@/data/usecases/load-account-by-token-usecase'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { mockDecrypter } from '../../mocks'
import { Decrypter } from '../protocols/criptography'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}
const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter('any_value')
  const sut = new LoadAccountByTokenUseCase(decrypterStub)
  return {
    sut,
    decrypterStub
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
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
