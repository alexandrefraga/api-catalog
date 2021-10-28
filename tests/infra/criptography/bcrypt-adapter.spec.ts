import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash_value')
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('Brcypt Adapter', () => {
  describe('hash', () => {
    test('Should call Bcrypt with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toBeCalledWith('any_value', salt)
    })

    test('Should BcrypteAdapter throw if Bcrypt throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrowError()
    })

    test('Should return a hash on success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash_value')
    })
  })

  describe('Compare', () => {
    test('Should call Bcrypt with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_password', 'hashed_value')
      expect(compareSpy).toBeCalledWith('any_password', 'hashed_value')
    })

    test('Shoul BcryptAdapter return true when bcrypt compare returns true', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Shoul BcryptAdapter return false when bcrypt compare returns false', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(false))
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Shoul throw if bcrypt compare throws ', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.reject(new Error()))
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrowError()
    })
  })
})
