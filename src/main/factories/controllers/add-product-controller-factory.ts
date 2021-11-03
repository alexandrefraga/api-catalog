import { AddProductUseCase } from '@/data/usecases/product/add-product-usecase'
import { LogErrorMongoRepository } from '@/infra/db/mongodb/log-error-repository'
import { ProductMongoRepository } from '@/infra/db/mongodb/product-repository'
import { StoreMongoRepository } from '@/infra/db/mongodb/store-repository'
import { LogControllerDecorator } from '@/main/decorator/log-controller-decorator'
import { AddProductController } from '@/presentation/controllers/product/add-product-controller'
import { Controller } from '@/presentation/controllers/controller'

export const makeAddProductController = (): Controller => {
  const loadStoreRepository = new StoreMongoRepository()
  const loadProductByDataRepository = new ProductMongoRepository()
  const addProductRepository = new ProductMongoRepository()
  const addProductUsecase = new AddProductUseCase(loadStoreRepository, loadProductByDataRepository, addProductRepository)
  const addProductController = new AddProductController(addProductUsecase)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(addProductController, logErrorRepository)
}
