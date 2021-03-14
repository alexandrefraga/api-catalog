import { Middleware } from '@/presentation/protocolls'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { forbidden } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'

type SutTypes = {
  sut: Middleware
}
const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token no exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.execute({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
