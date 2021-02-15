import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import jwt from 'jsonwebtoken'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('Jwt Adapter', () => {
  test('Should call Jwt with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })
})
