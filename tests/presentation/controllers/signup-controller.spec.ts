import { SignUpController } from '@/presentation/controllers/signup-controller'
import { MissingParamError } from '@/presentation/errors'
type SutTypes = {
  sut: SignUpController
}
const makeSut = (): SutTypes => {
  const sut = new SignUpController()
  return {
    sut
  }
}
describe('SignUpController', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
})
