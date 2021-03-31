import { LoadAccountByTokenUseCase } from '@/data/usecases/account/load-account-by-token-usecase'
import { KeyRoute } from '@/domain/models/account-model'
import { JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import env from '@/main/config/env'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { Middleware } from '@/presentation/protocolls'

export const makeAuthMiddleware = (key?: KeyRoute): Middleware => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  const loadAccountByToken = new LoadAccountByTokenUseCase(decrypter, loadAccountByTokenRepository)
  return new AuthMiddleware(loadAccountByToken, key)
}
