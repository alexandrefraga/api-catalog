import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'
import { AddKeyInAccountUseCase } from '@/data/usecases/account/add-key-in-account-usecase'
import { makeKeyAdminStore, mockAddKeyInAccountRepository } from '../../mocks'
import { AddKeyInAccountRepository } from '@/data/protocols/db/account/add-key-in-account-repository'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddKeyInAccount
  addKeyInAccountRepositoryStub: AddKeyInAccountRepository
}

const makeSut = (): SutTypes => {
  const addKeyInAccountRepositoryStub = mockAddKeyInAccountRepository()
  const sut = new AddKeyInAccountUseCase(addKeyInAccountRepositoryStub)
  return {
    sut,
    addKeyInAccountRepositoryStub
  }
}

describe('AddKeyInAccount Usecase', () => {
  beforeAll(async () => { MockDate.set(new Date()) })
  afterAll(async () => { MockDate.reset() })

  it('Should call AddKeyInAccountRepository with correct values', async () => {
    const { sut, addKeyInAccountRepositoryStub } = makeSut()
    const addKeySpy = jest.spyOn(addKeyInAccountRepositoryStub, 'addKey')
    await sut.add('any_id', makeKeyAdminStore())
    expect(addKeySpy).toHaveBeenCalledWith('any_id', makeKeyAdminStore())
  })

  it('Should trow if AddKeyInAccountRepository throws', async () => {
    const { sut, addKeyInAccountRepositoryStub } = makeSut()
    jest.spyOn(addKeyInAccountRepositoryStub, 'addKey').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add('any_id', makeKeyAdminStore())
    await expect(promise).rejects.toThrow()
  })

  it('Should trow if AddKeyInAccountRepository return false', async () => {
    const { sut, addKeyInAccountRepositoryStub } = makeSut()
    jest.spyOn(addKeyInAccountRepositoryStub, 'addKey').mockReturnValueOnce(Promise.resolve(false))
    const promise = sut.add('any_id', makeKeyAdminStore())
    await expect(promise).rejects.toThrow()
  })
})
