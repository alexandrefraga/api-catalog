import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('valid_token')
  }
}))
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  test('Should call Sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    const param = JSON.stringify({ id: 'any_value' })
    await sut.encrypt(param)
    expect(signSpy).toHaveBeenCalledWith(param, 'secret')
  })

  test('Should JwtAdapter throw if Jwt throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrowError()
  })

  test('Should return a token if sign success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('any_value')
    expect(token).toBe('valid_token')
  })
})
