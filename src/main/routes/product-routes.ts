import { Router } from 'express'
import { makeAddProductController } from '@/main/factories/controllers/add-product-controller-factory'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { routeKeyStoreFactory } from '../factories/route-key/routeKey-store-factory'
import { Role } from '@/domain/models/account-model'

export default (router: Router): void => {
  const keyRoute = routeKeyStoreFactory(Role.storeAdmin)
  const logedStoreAdmin = adaptMiddleware(makeAuthMiddleware(keyRoute))
  router.post('/addProduct/:storeId', logedStoreAdmin, adaptRoute(makeAddProductController()))
}
