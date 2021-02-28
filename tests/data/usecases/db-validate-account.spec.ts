import { DbValidateAccount } from '@/data/usecases/db-validate-account'
import { ValidateAccount } from '@/domain/usecases/validate-account'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { mockDecrypter } from '../mocks'

type SutTypes = {
  sut: ValidateAccount
  jwtAdapterStub: Decrypter
}
const makeSut = (): SutTypes => {
  const jwtAdapterStub = mockDecrypter()
  const sut = new DbValidateAccount(jwtAdapterStub)
  return {
    sut,
    jwtAdapterStub
  }
}
describe('DbValidateAccount', () => {
  test('Should call Decrypter with correct token', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    const verifySpy = jest.spyOn(jwtAdapterStub, 'decrypt')
    await sut.validate('any_token')
    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  test('Should DbAddAccount throw if Decrypter throws', async () => {
    const { sut, jwtAdapterStub } = makeSut()
    jest.spyOn(jwtAdapterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })
})
