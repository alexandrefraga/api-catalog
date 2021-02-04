import { DbAddAccount } from '@/data/usecases/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { EmailValidation } from '@/validation/validators/email-validation'
import { RequiredAndCompareFieldsValidation } from '@/validation/validators/required-and-compare-fields'
import { RequiredFieldValidation } from '@/validation/validators/required-field'
import { ValidationComposite } from '@/validation/validators/validation-composite'

export const makeSignUpControler = (): SignUpController => {
  const validation = new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredAndCompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation(new EmailValidatorAdapter(), 'email')
  ])
  const addAccount = new DbAddAccount(new BcryptAdapter(12), new AccountMongoRepository())

  return new SignUpController(validation, addAccount)
}
