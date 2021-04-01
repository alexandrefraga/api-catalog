import { mockValidator } from '@/../tests/mocks'
import { AddProductController } from '@/presentation/controllers/product/add-product-controller'
import { Validation } from '@/presentation/protocolls'

type SutTypes = {
  sut: AddProductController
  validatorStub: Validation
}
const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const sut = new AddProductController(validatorStub)
  return {
    sut,
    validatorStub
  }
}
describe('AddProduct Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = { data: 'any_data' }
    await sut.execute(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
})
