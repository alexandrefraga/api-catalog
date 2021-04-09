import { InvalidParamError } from '@/data/errors'
import { MissingParamError } from '@/presentation/errors'
import { PhoneNumberArrayValidation } from '@/validation/validators/phone-number-validation'

describe('Phone Number Validation', () => {
  test('Should return error if validation fails', async () => {
    const sut = new PhoneNumberArrayValidation('phoneNumber', 0)
    const response = await sut.validate({})
    expect(response).toEqual(new MissingParamError('phoneNumber'))
  })

  test('Should return error if an array not is provided', async () => {
    const sut = new PhoneNumberArrayValidation('phoneNumber', 0)
    const response = await sut.validate({ phoneNumber: '51-999999999' })
    expect(response).toEqual(new InvalidParamError('phoneNumber'))
  })

  test('Should return error if a min length array not is provided', async () => {
    const sut = new PhoneNumberArrayValidation('phoneNumber', 1)
    const response = await sut.validate({ phoneNumber: [] })
    expect(response).toEqual(new InvalidParamError('phoneNumber'))
  })

  test('Should return null if is valid data array', async () => {
    const sut = new PhoneNumberArrayValidation('phoneNumber', 1)
    const response = await sut.validate({ phoneNumber: ['51-88888888', '51-999999999'] })
    expect(response).toBeNull()
  })

  test('Should return error if is invalid data array', async () => {
    const sut = new PhoneNumberArrayValidation('phoneNumber', 1)
    const response1 = await sut.validate({ phoneNumber: ['51-88888888', '51-7777777', '51-999999999'] })
    expect(response1).toEqual(new InvalidParamError('phoneNumber: 51-7777777'))
    const response2 = await sut.validate({ phoneNumber: ['51-88888888', '51-999999999', '51-0000000000'] })
    expect(response2).toEqual(new InvalidParamError('phoneNumber: 51-0000000000'))
    const response3 = await sut.validate({ phoneNumber: ['51-88888888', '517777777', '51-999999999'] })
    expect(response3).toEqual(new InvalidParamError('phoneNumber: 517777777'))
    const response4 = await sut.validate({ phoneNumber: ['51-88888888', 517777777, '51-999999999'] })
    expect(response4).toEqual(new InvalidParamError('phoneNumber: 517777777'))
    const response5 = await sut.validate({ phoneNumber: ['51-88888888', '51-a2222222', '51-999999999'] })
    expect(response5).toEqual(new InvalidParamError('phoneNumber: 51-a2222222'))
  })
})
