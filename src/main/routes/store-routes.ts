import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddStoreController } from '../factories/controllers/add-store-controller-factory'

export default (router: Router): void => {
  router.post('/addStore', adaptRoute(makeAddStoreController()))
}
