import { AddAccountUseCase } from '@/data/usecases/account/add-account-usecase'
import { Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db'
import { mockAccountModel, mockAddAccountParams } from '../../mocks/mock-account'
import { mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '../../mocks'

const addAccountParams = mockAddAccountParams()
type SutTypes = {
  sut: AddAccountUseCase
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailStub: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValue(Promise.resolve(null))
  const sut = new AddAccountUseCase(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailStub
  }
}
describe('AddAccount Usecase', () => {
  it('Should call LoadAccountByEmail only with the correct email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    const hashSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    await sut.add(addAccountParams)
    expect(hashSpy).toBeCalledWith(addAccountParams.email)
  })

  it('Should return null if LoadAccountByEmail return an account', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(addAccountParams)
    expect(account).toBeNull()
  })

  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(addAccountParams)
    expect(hashSpy).toBeCalledWith(addAccountParams.password)
  })

  it('Should AddAccountUseCase throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(addAccountParams)
    expect(addSpy).toBeCalledWith(Object.assign(addAccountParams, { password: 'hashed_value' }))
  })

  it('Should AddAccountUseCase throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should AddAccountUseCase return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(addAccountParams)
    expect(response.id).toBeTruthy()
    expect(response.name).toEqual(addAccountParams.name)
    expect(response.email).toEqual(addAccountParams.email)
  })
})
