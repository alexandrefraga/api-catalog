import { Hasher } from '@/data/protocols/criptography/hasher'
import { HasherComparer } from '../protocols/criptography/hasher-compare'

export const mockHasher = (): Hasher => {
  class Hasher implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }
  return new Hasher()
}

export const mockHasherComparer = (): HasherComparer => {
  class HasherComparerStub implements HasherComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HasherComparerStub()
}
