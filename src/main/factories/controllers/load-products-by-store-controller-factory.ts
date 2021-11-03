import { LoadProductsByStoreUseCase } from '@/data/usecases/product/load-products-by-store-usecase'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { ProductMongoRepository } from '@/infra/db/mongodb/product-repository'
import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { LoadProductsByStoreController } from '@/presentation/controllers/product/load-products-by-store-controller'
import { Controller } from '@/presentation/controllers/controller'

export const makeLoadProductsByStoreController = (): Controller => {
  const loadStoreByIdRepository = new StoreMongoRepository()
  const loadProductByStoreRepository = new ProductMongoRepository()
  const loadProductByStoreUseCase = new LoadProductsByStoreUseCase(loadStoreByIdRepository, loadProductByStoreRepository)
  const loadProductByStoreController = new LoadProductsByStoreController(loadProductByStoreUseCase)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loadProductByStoreController, logErrorRepository)
}
