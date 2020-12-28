import { SignUpController } from '@/presentation/controllers/signup-controller'

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
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.execute(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})
