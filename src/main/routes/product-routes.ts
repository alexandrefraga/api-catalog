import { Router } from 'express'
import { makeAddProductController } from '@/main/factories/controllers/add-product-controller-factory'
import { expressAdaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { routeKeyStoreFactory } from '../factories/route-key/routeKey-store-factory'
import { Role } from '@/domain/models/account-model'
import { makeLoadProductsByStoreController } from '../factories/controllers/load-products-by-store-controller-factory'

export default (router: Router): void => {
  const keyRoute = routeKeyStoreFactory(Role.storeAdmin)
  const logedStoreAdmin = adaptMiddleware(makeAuthMiddleware(keyRoute))
  const loged = adaptMiddleware(makeAuthMiddleware())
  router.post('/product/:storeId', logedStoreAdmin, expressAdaptRoute(makeAddProductController()))
  router.get('/products/:storeId', loged, expressAdaptRoute(makeLoadProductsByStoreController()))
}
