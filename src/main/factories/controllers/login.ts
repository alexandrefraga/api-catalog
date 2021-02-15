import { DbAuthentication } from '@/data/usecases/db-athentication'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { LoginController } from '@/presentation/controllers/login-controller'
import { Controller } from '@/presentation/protocolls'
import { EmailValidation } from '@/validation/validators/email-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import env from '@/main/config/env'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'

export const makeLoginControler = (): Controller => {
  const validator = new ValidationComposite([
    new EmailValidation(new EmailValidatorAdapter(), 'email'),
    new RequiredFieldValidation('password')
  ])

  const accountRepository = new AccountMongoRepository()
  const hasher = new BcryptAdapter(12)
  const encrypter = new JwtAdapter(env.jwtSecret)
  const authenticator = new DbAuthentication(accountRepository, hasher, encrypter, accountRepository)

  const loginController = new LoginController(validator, authenticator)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}
