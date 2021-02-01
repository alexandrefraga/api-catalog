import { Hasher } from '@/data/protocols/criptography'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return null
  }
}
