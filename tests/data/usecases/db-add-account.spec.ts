import { DbAddAccount } from '@/data/usecases/db-add-account'
import { Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { mockHasher, mockAddAccountRepository } from '../mocks'
import { mockAccountModel, mockAddAccountParams } from '../../domain/mocks/mock-account'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(hashSpy).toBeCalledWith(mockAddAccountParams().password)
  })

  test('Should DbAddAccount throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toBeCalledWith(Object.assign(mockAddAccountParams(), { password: 'hashed_value' }))
  })

  test('Should DbAddAccount throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should DbAddAccount return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(mockAddAccountParams())
    expect(response).toEqual(mockAccountModel())
  })
})
