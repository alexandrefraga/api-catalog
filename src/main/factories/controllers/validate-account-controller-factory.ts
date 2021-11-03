import { Controller } from '@/presentation/controllers/controller'
import { ValidateAccountController } from '@/presentation/controllers/account/validate-account-controller'
import { ValidateAccountUseCase } from '@/data/usecases/account/validate-account-usecase'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import env from '@/main/config/env'
import { SignatureTokenMongoRepository } from '@/infra/db/mongodb/signature-token-repository'

export const makeValidateAccountController = (): Controller => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const signatureByTokenRepository = new SignatureTokenMongoRepository()
  const updateEmailRepository = new AccountMongoRepository()
  const validateAccount = new ValidateAccountUseCase(decrypter, signatureByTokenRepository, updateEmailRepository)
  const validateAccountController = new ValidateAccountController(validateAccount)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(validateAccountController, logErrorRepository)
}
