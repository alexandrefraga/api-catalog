import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('valid_token')
  },

  async verify (): Promise<string> {
    return Promise.resolve('decrypted_value')
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

  test('Should JwtAdapter throw if sign throws', async () => {
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

  test('Should call Verify with correct values', async () => {
    const sut = makeSut()
    const verifySpy = jest.spyOn(jwt, 'verify')
    await sut.decrypt('any_value')
    expect(verifySpy).toHaveBeenCalledWith('any_value', 'secret')
  })

  test('Should JwtAdapter throw if decrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.decrypt('any_value')
    await expect(promise).rejects.toThrowError()
  })

  test('Should return a decrypted data if Verify on success', async () => {
    const sut = makeSut()
    const dataDecrypted = await sut.decrypt('any_value')
    expect(dataDecrypted).toBe('decrypted_value')
  })
})
