import { SaveKeyInAccount } from '@/domain/usecases/save-key'
import { SaveKeyInAccountUseCase } from '@/data/usecases/save-key-in-account-usecase'
import { makeKeyAdminStore, mockSaveKeyInAccountRepository } from '../../mocks'
import { SaveKeyInAccountRepository } from '@/data/protocols/db/save-key-in-account-repository'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveKeyInAccount
  saveKeyInAccountRepositoryStub: SaveKeyInAccountRepository
}

const makeSut = (): SutTypes => {
  const saveKeyInAccountRepositoryStub = mockSaveKeyInAccountRepository()
  const sut = new SaveKeyInAccountUseCase(saveKeyInAccountRepositoryStub)
  return {
    sut,
    saveKeyInAccountRepositoryStub
  }
}

describe('SaveKeyInAccount Usecase', () => {
  beforeAll(async () => { MockDate.set(new Date()) })
  afterAll(async () => { MockDate.reset() })

  test('Should call SaveKeyInAccountRepository with correct values', async () => {
    const { sut, saveKeyInAccountRepositoryStub } = makeSut()
    const saveKeySpy = jest.spyOn(saveKeyInAccountRepositoryStub, 'saveKey')
    await sut.save('any_id', makeKeyAdminStore())
    expect(saveKeySpy).toHaveBeenCalledWith('any_id', makeKeyAdminStore())
  })

  test('Should trow if SaveKeyInAccountRepository throws', async () => {
    const { sut, saveKeyInAccountRepositoryStub } = makeSut()
    jest.spyOn(saveKeyInAccountRepositoryStub, 'saveKey').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save('any_id', makeKeyAdminStore())
    await expect(promise).rejects.toThrow()
  })

  test('Should trow if SaveKeyInAccountRepository return false', async () => {
    const { sut, saveKeyInAccountRepositoryStub } = makeSut()
    jest.spyOn(saveKeyInAccountRepositoryStub, 'saveKey').mockReturnValueOnce(Promise.resolve(false))
    const promise = sut.save('any_id', makeKeyAdminStore())
    await expect(promise).rejects.toThrow()
  })
})
