import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import jwt from 'jsonwebtoken'
import MockDate from 'mockdate'

jest.mock('jsonwebtoken', () => ({
  async sign (objParams: any, secret: string): Promise<string> {
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
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  describe('Encrypt', () => {
    it('Should call Sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      const jsonParams = JSON.stringify({ id: 'any_value' })
      await sut.encrypt(jsonParams)
      const objParams = Object.assign({}, JSON.parse(jsonParams), { created: Date.now() })
      expect(signSpy).toHaveBeenCalledWith(objParams, 'secret')
    })

    it('Should return a token if Sign success', async () => {
      const sut = makeSut()
      const jsonParams = JSON.stringify({ id: 'any_value' })
      const token = await sut.encrypt(jsonParams)
      expect(token).toBe('valid_token')
    })

    it('Should throw if Sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_value')
      await expect(promise).rejects.toThrowError()
    })
  })

  describe('Decrypt', () => {
    it('Should call Verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_value')
      expect(verifySpy).toHaveBeenCalledWith('any_value', 'secret')
    })

    it('Should throw if Verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt('any_value')
      await expect(promise).rejects.toThrowError()
    })

    it('Should return a decrypted data if Verify on success', async () => {
      const sut = makeSut()
      const dataDecrypted = await sut.decrypt('any_value')
      expect(dataDecrypted).toBe('decrypted_value')
    })
  })
})
