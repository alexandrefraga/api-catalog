import { Middleware } from '@/presentation/protocolls'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { forbidden } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { mockLoadAccountByToken } from '../../mocks'

type SutTypes = {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token no exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.execute({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken if x-access-token exists in headers', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const request = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    await sut.execute(request)
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })
})
