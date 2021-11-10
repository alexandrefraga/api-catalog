import { HttpRequest, Middleware } from '@/presentation/protocolls'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-Token'
import { makeKeyParamsAdmin, makeKeyParamsAdminStore, makeKeyRouteAdmin, makeKeyRouteAdminStore, mockAccountModel, mockLoadAccountByToken } from '../../mocks'
import { KeyRoute } from '@/domain/models/account-model'

const fakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' },
  params: { storeId: 'store_id' }
})

type SutTypes = {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (key?: KeyRoute): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, key)
  return {
    sut,
    loadAccountByTokenStub
  }
}
describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token no exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.execute({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.execute(fakeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct values if a key is provided with requiredStoreId equal to true', async () => {
    const keyRoute = makeKeyRouteAdminStore()
    const { sut, loadAccountByTokenStub } = makeSut(keyRoute)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.execute(fakeRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', makeKeyParamsAdminStore())
  })

  it('Should call LoadAccountByToken with correct values if a key is provided with requiredStoreId equal to false', async () => {
    const keyRoute = makeKeyRouteAdmin()
    const { sut, loadAccountByTokenStub } = makeSut(keyRoute)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.execute(fakeRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', makeKeyParamsAdmin())
  })

  it('Should call LoadAccountByToken with correct values if a key no is provided', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.execute(fakeRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', null)
  })

  it('Should call LoadAccountByToken with correct values if no params in request', async () => {
    const keyRoute = makeKeyRouteAdminStore()
    const { sut, loadAccountByTokenStub } = makeSut(keyRoute)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.execute({ headers: { 'x-access-token': 'any_token' } })
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', {
      typeKey: 'store',
      role: 'store administrator',
      storeId: undefined,
      attribute: 'any'
    })
  })

  it('Should return 500 LoadAccountByToken trows', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(fakeRequest())
    expect(response).toEqual(success({ userId: mockAccountModel().id }))
  })
})
