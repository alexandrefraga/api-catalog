import { DbAddAccount } from '@/data/usecases/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { Controller } from '@/presentation/protocolls'
import { EmailValidation } from '@/validation/validators/email-validation'
import { RequiredAndCompareFieldsValidation } from '@/validation/validators/required-and-compare-fields'
import { RequiredFieldValidation } from '@/validation/validators/required-field'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'

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
  const addAccount = new DbAddAccount(hasher, addAccountRepository, loadAccountByEmailRepository)
  const signUpController = new SignUpController(validation, addAccount)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}