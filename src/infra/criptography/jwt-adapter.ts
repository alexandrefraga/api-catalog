import { Encrypter, Decrypter } from '@/data/protocols/criptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (jsonParams: string): Promise<string> {
    const token = await jwt.sign(jsonParams, this.secret)
    return token
  }

  async decrypt (token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secret)
    return value
  }
}
