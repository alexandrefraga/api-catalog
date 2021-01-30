import { Hasher } from '@/data/protocols/criptography/hasher'

export const mockHasher = (): Hasher => {
  class Hasher implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }
  return new Hasher()
}
