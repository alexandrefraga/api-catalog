import { DbValidateAccount } from '@/data/usecases/db-validate-account'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { ValidateAccountController } from '@/presentation/controllers/validate-account-controller'
import { Controller } from '@/presentation/protocolls'
import { RequiredFieldValidation } from '@/validation/validators/required-field'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import env from '@/main/config/env'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'

export const makeValidateAccountController = (): Controller => {
  const validation = new ValidationComposite([
    new RequiredFieldValidation('tokenValidation')
  ])
  const decrypter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  const updateEmailRepository = new AccountMongoRepository()
  const validateAccount = new DbValidateAccount(decrypter, loadAccountByTokenRepository, updateEmailRepository)
  const validateAccountController = new ValidateAccountController(validation, validateAccount)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(validateAccountController, logErrorRepository)
}
