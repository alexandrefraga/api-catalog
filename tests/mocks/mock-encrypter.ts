import { Encrypter, Decrypter } from '@/data/protocols/criptography'

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('encrypted_value')
    }
  }
  return new EncrypterStub()
}

export const mockDecrypter = (decryptedResponse: any): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<any> {
      return Promise.resolve(decryptedResponse)
    }
  }
  return new DecrypterStub()
}
