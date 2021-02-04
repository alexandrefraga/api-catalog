import { Router } from 'express'
import { makeSignUpControler } from '@/main/factories/controllers/signup'
import { adaptRoute } from '@/main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpControler()))
}
