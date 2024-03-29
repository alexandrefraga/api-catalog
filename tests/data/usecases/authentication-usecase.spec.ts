import { AuthenticationUseCase } from '@/data/usecases/account/athentication-usecase'
import { AuthenticationParameters } from '@/domain/usecases/account/authentication'
import { LoadAccountByEmailRepository, UpdateTokenRepository } from '@/data/protocols/db'
import { HasherComparer, Encrypter } from '@/data/protocols/criptography'
import { mockLoadAccountByEmailRepository, mockHasherComparer, mockEncrypter, mockUpdateTokenRepository } from '../../mocks'
import { mockAccountModel, mockAuthenticationParams } from '../../mocks/mock-account'
import MockDate from 'mockdate'

const params: AuthenticationParameters = mockAuthenticationParams()

type SutTypes = {
  sut: AuthenticationUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hasherComparerStub: HasherComparer
  encrypterStub: Encrypter
  updateTokenRepositoryStub: UpdateTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hasherComparerStub = mockHasherComparer()
  const encrypterStub = mockEncrypter()
  const updateTokenRepositoryStub = mockUpdateTokenRepository()
  const sut = new AuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hasherComparerStub,
    encrypterStub,
    updateTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherComparerStub,
    encrypterStub,
    updateTokenRepositoryStub
  }
}
describe('Authentication UseCase', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(params)
    expect(loadByEmailSpy).toHaveBeenCalledWith(params.email, new Date())
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const response = await sut.auth(params)
    expect(response).toBeNull()
  })

  it('Should call HashedComparer if LoadAccountByEmailRepository return an account', async () => {
    const { sut, hasherComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hasherComparerStub, 'compare')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    expect(compareSpy).toHaveBeenCalledWith(params.password, account.password)
  })

  it('Should throw if HashedComparer throws', async () => {
    const { sut, hasherComparerStub } = makeSut()
    jest.spyOn(hasherComparerStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  it('should return null if HasherComparer returns false', async () => {
    const { sut, hasherComparerStub } = makeSut()
    jest.spyOn(hasherComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.auth(params)
    expect(response).toBeNull()
  })

  it('Should call Encrypter if HasherComparer return true', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    const encryptParam = JSON.stringify({ id: account.id })
    expect(encryptSpy).toHaveBeenCalledWith(encryptParam)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  it('Should call UpdateTokenRepository with correct values ', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    const updateTokenSpy = jest.spyOn(updateTokenRepositoryStub, 'updateToken')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    expect(updateTokenSpy).toHaveBeenCalledWith(await mockEncrypter().encrypt(''), account.id)
  })

  it('Should throw if UpdateTokenRepository throws', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  it('Should null if UpdateTokenRepository false', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockResolvedValueOnce(Promise.resolve(false))
    const response = await sut.auth(params)
    expect(response).toBeNull()
  })

  it('should return an AuthenticationResponse if UpdateTokenRepository on success', async () => {
    const { sut } = makeSut()
    const response = await sut.auth(params)
    expect(response.token).toBe(await mockEncrypter().encrypt(''))
    expect(response.name).toBe(mockAccountModel().name)
  })
})
