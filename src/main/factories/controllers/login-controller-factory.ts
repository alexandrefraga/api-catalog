import { Controller } from '@/presentation/protocolls'
import { LoginController } from '@/presentation/controllers/account/login-controller'
import { AuthenticationUseCase } from '@/data/usecases/account/athentication-usecase'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '@/validation/validators'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import env from '@/main/config/env'

export const makeLoginControler = (): Controller => {
  const validator = new ValidationComposite([
    new EmailValidation(new EmailValidatorAdapter(), 'email'),
    new RequiredFieldValidation('password')
  ])

  const accountRepository = new AccountMongoRepository()
  const hasher = new BcryptAdapter(12)
  const encrypter = new JwtAdapter(env.jwtSecret)
  const authenticator = new AuthenticationUseCase(accountRepository, hasher, encrypter, accountRepository)

  const loginController = new LoginController(validator, authenticator)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}
