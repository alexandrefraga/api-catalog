import { DbAuthentication } from '@/data/usecases/db-athentication'
import { AuthenticationParameters } from '@/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '@/domain/usecases/load-account'
import { mockLoadAccountByEmailRepository } from '../mocks/mock-db-account-repository'
import { mockAuthenticationParams } from '../../domain/mocks/mock-account'

const params: AuthenticationParameters = mockAuthenticationParams()

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}
describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(params)
    expect(loadByEmailSpy).toHaveBeenLastCalledWith(params.email)
  })

  test('Should LoadAccountByEmailRepository throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
  })
})
