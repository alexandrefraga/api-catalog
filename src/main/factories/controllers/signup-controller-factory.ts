import { Controller } from '@/presentation/controllers/controller'
import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { AddAccountUseCase } from '@/data/usecases/account/add-account-usecase'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { NodemailerAdapter } from '@/infra/service/nodemailer-adapter'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import env from '@/main/config/env'
import { AddSignatureTokenUseCase } from '@/data/usecases/add-signature-token-usecase'
import { SignatureTokenMongoRepository } from '@/infra/db/mongodb/signature-token-repository'
import { SendMailUseCase } from '@/data/usecases/send-mail-usecase'
import { nodemailerAdaptSendParams } from '@/infra/service/nodemailer-helper'

export const makeSignUpControler = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const encrypter = new JwtAdapter(env.jwtSecret)
  const mailService = new NodemailerAdapter(env.mailParams, env.mailFrom, env.baseUrl)
  const addAccount = new AddAccountUseCase(hasher, addAccountRepository, loadAccountByEmailRepository)
  const addSignaturetokenRepository = new SignatureTokenMongoRepository()
  const addSignature = new AddSignatureTokenUseCase(encrypter, addSignaturetokenRepository)
  const sendMail = new SendMailUseCase(mailService, 'mail', nodemailerAdaptSendParams)
  const signUpController = new SignUpController(emailValidator, addAccount, addSignature, sendMail)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}
