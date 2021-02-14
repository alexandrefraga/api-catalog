import { Encrypter } from '../protocols/criptography/encrypter'

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('encrypted_value')
    }
  }
  return new EncrypterStub()
}
