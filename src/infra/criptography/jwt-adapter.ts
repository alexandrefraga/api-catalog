import { Encrypter } from '@/data/protocols/criptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (jsonParams: string): Promise<string> {
    const token = await jwt.sign(jsonParams, this.secret)
    return token
  }
}
