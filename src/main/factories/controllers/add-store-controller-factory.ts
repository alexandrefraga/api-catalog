import { AddStoreUseCase } from '@/data/usecases/store/add-store-usecase'
import { AddKeyInAccountUseCase } from '@/data/usecases/account/add-key-in-account-usecase'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { AddStoreController } from '@/presentation/controllers/store/add-store-controller'
import { Controller } from '@/presentation/protocolls'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddStoreController = (): Controller => {
  const validator = new ValidationComposite([
    new RequiredFieldValidation('company')
  ])
  const loadStoreRepository = new StoreMongoRepository()
  const addStoreRepository = new StoreMongoRepository()
  const addStore = new AddStoreUseCase(loadStoreRepository, addStoreRepository)
  const addKeyRepository = new AccountMongoRepository()
  const addKeyInAccountUsecase = new AddKeyInAccountUseCase(addKeyRepository)
  const addStoreController = new AddStoreController(validator, addStore, addKeyInAccountUsecase)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(addStoreController, logErrorRepository)
}
