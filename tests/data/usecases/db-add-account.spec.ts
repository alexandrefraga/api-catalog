import { AddAccountParams } from '@/domain/usecases/add-account'
import { DbAddAccount } from '@/data/usecases/db-add-account'
import { Hasher } from '@/data/protocols/criptography'
import { mockHasher } from '../mocks'

const fakeAccount = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'any_password'
})
type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const sut = new DbAddAccount(hasherStub)
  return {
    sut,
    hasherStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(fakeAccount())
    expect(hashSpy).toBeCalledWith(fakeAccount().password)
  })

  test('Should DbAddAccount throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(fakeAccount())
    await expect(promise).rejects.toThrow()
  })
})
