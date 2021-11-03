import { Controller } from '@/presentation/controllers/controller'
import { HttpResponse } from '@/presentation/protocolls'
import { ServerError } from '@/presentation/errors'

class ControllerStub extends Controller {
  constructor (
    private readonly data: HttpResponse = { statusCode: 200, body: 'any_data' }
  ) { super() }

  async perform (httpRequest: any): Promise<HttpResponse> {
    return await Promise.resolve(this.data)
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 400 if validation fails', async () => {
    jest.spyOn(sut, 'buildValidators').mockReturnValueOnce([
      { validate: async () => Promise.resolve(new Error('validation fail')) }
    ])
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('validation fail')
    })
  })

  it('should return 500 if perfom throws', async () => {
    jest.spyOn(sut, 'perform').mockImplementationOnce(() => { throw new Error('perform fail') })
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError('perform fail')
    })
  })

  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({ statusCode: 200, body: 'any_data' })
  })
})
