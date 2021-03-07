import { Controller } from '@/presentation/protocolls'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { DbAddAccount } from '@/data/usecases/db-add-account'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { NodemailerAdapter } from '@/infra/service/nodemailer-adapter'
import { ValidationComposite, RequiredAndCompareFieldsValidation, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import env from '@/main/config/env'

export const makeSignUpControler = (): Controller => {
  const validation = new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredAndCompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation(new EmailValidatorAdapter(), 'email')
  ])
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const encrypter = new JwtAdapter(env.jwtSecret)
  const updateTokenRepository = new AccountMongoRepository()
  const mailService = new NodemailerAdapter(env.mailParams, env.mailFrom, env.baseUrl)
  const addAccount = new DbAddAccount(hasher, addAccountRepository, loadAccountByEmailRepository, encrypter, updateTokenRepository, mailService, 'mail')
  const signUpController = new SignUpController(validation, addAccount)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}
