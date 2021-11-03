import { AddStoreUseCase } from '@/data/usecases/store/add-store-usecase'
import { AddKeyInAccountUseCase } from '@/data/usecases/account/add-key-in-account-usecase'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { AddStoreController } from '@/presentation/controllers/store/add-store-controller'
import { Controller } from '@/presentation/controllers/controller'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeAddStoreController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const loadStoreRepository = new StoreMongoRepository()
  const addStoreRepository = new StoreMongoRepository()
  const addStore = new AddStoreUseCase(loadStoreRepository, addStoreRepository)
  const addKeyRepository = new AccountMongoRepository()
  const addKeyInAccountUsecase = new AddKeyInAccountUseCase(addKeyRepository)
  const addStoreController = new AddStoreController(emailValidator, addStore, addKeyInAccountUsecase)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(addStoreController, logErrorRepository)
}
