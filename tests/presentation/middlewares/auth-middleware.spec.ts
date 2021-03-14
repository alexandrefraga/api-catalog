import { HttpRequest, Middleware } from '@/presentation/protocolls'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-Token'
import { mockAccountModel, mockLoadAccountByToken } from '../../mocks'

const fakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

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

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.execute(fakeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken if x-access-token exists in headers', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.execute(fakeRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 500 LoadAccountByToken trows', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(fakeRequest())
    expect(response).toEqual(success({ userId: mockAccountModel().id }))
  })
})
