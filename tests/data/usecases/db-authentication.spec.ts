import { DbAuthentication } from '@/data/usecases/db-athentication'
import { AuthenticationParameters } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'
import { mockLoadAccountByEmailRepository, mockHasherComparer, mockEncrypter, mockUpdateTokenRepository } from '../mocks'
import { mockAccountModel, mockAuthenticationParams } from '../../domain/mocks/mock-account'
import { HasherComparer } from '../protocols/criptography/hasher-compare'
import { Encrypter } from '../protocols/criptography/encrypter'
import { UpdateTokenRepository } from '../protocols/db/update-token-repository'

const params: AuthenticationParameters = mockAuthenticationParams()

type SutTypes = {
  sut: DbAuthentication
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
  const sut = new DbAuthentication(
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
describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(params)
    expect(loadByEmailSpy).toHaveBeenCalledWith(params.email)
  })

  test('Should DbAuthentication throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  test('should DbAuthentication return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const response = await sut.auth(params)
    expect(response).toBeNull()
  })

  test('Should call HashedComparer if LoadAccountByEmailRepository return an account', async () => {
    const { sut, hasherComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hasherComparerStub, 'compare')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    expect(compareSpy).toHaveBeenCalledWith(params.password, account.password)
  })

  test('Should DbAuthentication throw if HashedComparer throws', async () => {
    const { sut, hasherComparerStub } = makeSut()
    jest.spyOn(hasherComparerStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  test('should DbAuthentication return null if HasherComparer returns false', async () => {
    const { sut, hasherComparerStub } = makeSut()
    jest.spyOn(hasherComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.auth(params)
    expect(response).toBeNull()
  })

  test('Should call Encrypter if HasherComparer return true', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    expect(encryptSpy).toHaveBeenCalledWith(account.id)
  })

  test('Should DbAuthentication throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  test('should DbAuthentication return an AuthenticationResponse if encrypter on success', async () => {
    const { sut } = makeSut()
    const response = await sut.auth(params)
    expect(response.token).toBe(await mockEncrypter().encrypt(''))
    expect(response.name).toBe(mockAccountModel().name)
  })

  test('Should call UpdateTokenRepository with correct values ', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    const updateTokenSpy = jest.spyOn(updateTokenRepositoryStub, 'updateToken')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    expect(updateTokenSpy).toHaveBeenCalledWith(await mockEncrypter().encrypt(''), account.id)
  })

  test('Should DbAuthentication throw if UpdateTokenRepository throws', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })
})
