import { Router } from 'express'
import { makeSignUpControler } from '@/main/factories/controllers/signup-controller-factory'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoginControler } from '../factories/controllers/login-controller-factory'
import { makeValidateAccountController } from '../factories/controllers/validate-account-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpControler()))
  router.post('/login', adaptRoute(makeLoginControler()))
  router.get('/confirmation/:signature', adaptRoute(makeValidateAccountController()))
}
