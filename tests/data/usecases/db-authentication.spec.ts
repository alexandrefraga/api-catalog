import { DbAuthentication } from '@/data/usecases/db-athentication'
import { AuthenticationParameters } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'
import { mockLoadAccountByEmailRepository } from '../mocks/mock-db-account-repository'
import { mockAuthenticationParams } from '../../domain/mocks/mock-account'
import { HasherComparer } from '../protocols/criptography/hasher-compare'
import { mockHasherComparer } from '../mocks'

const params: AuthenticationParameters = mockAuthenticationParams()

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hasherComparerStub: HasherComparer
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hasherComparerStub = mockHasherComparer()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hasherComparerStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherComparerStub
  }
}
describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(params)
    expect(loadByEmailSpy).toHaveBeenCalledWith(params.email)
  })

  test('Should LoadAccountByEmailRepository throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should call HashedComparer if LoadAccountByEmailRepository return an account', async () => {
    const { sut, hasherComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hasherComparerStub, 'compare')
    const account = await mockLoadAccountByEmailRepository().loadByEmail('')
    await sut.auth(params)
    expect(compareSpy).toHaveBeenCalledWith(params.email, account.email)
  })
})
