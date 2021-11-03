import { Router } from 'express'
import { makeSignUpControler } from '@/main/factories/controllers/signup-controller-factory'
import { expressAdaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoginControler } from '../factories/controllers/login-controller-factory'
import { makeValidateAccountController } from '../factories/controllers/validate-account-controller-factory'

export default (router: Router): void => {
  router.post('/signup', expressAdaptRoute(makeSignUpControler()))
  router.post('/login', expressAdaptRoute(makeLoginControler()))
  router.get('/confirmation/:signature', expressAdaptRoute(makeValidateAccountController()))
}
