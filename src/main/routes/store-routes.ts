import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { expressAdaptRoute } from '../adapters/express-route-adapter'
import { makeAddStoreController } from '../factories/controllers/add-store-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const logedAuth = adaptMiddleware(makeAuthMiddleware())
  router.post('/store', logedAuth, expressAdaptRoute(makeAddStoreController()))
}
