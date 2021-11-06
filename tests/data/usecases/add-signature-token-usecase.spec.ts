import { AddSignatureTokenUseCase } from '@/data/usecases/add-signature-token-usecase'
import { SignatureTypes, SignatureSubjectTypes } from '@/domain/models/signature-token-model'
import { AddSignatureToken } from '@/domain/usecases/add-signature-token'
import { mockAccountModel, mockEncrypter, mockAddSignatureTokenRepository, mockSignatureTokenModel } from '../../mocks'
import { Encrypter } from '../protocols/criptography'
import { AddSignatureTokenRepository } from '../protocols/db/add-signature-token-repository'

const account = mockAccountModel()

type SutTypes = {
  sut: AddSignatureToken
  encrypterStub: Encrypter
  addSignatureTokenRepositoryStub: AddSignatureTokenRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = mockEncrypter()
  const addSignatureTokenRepositoryStub = mockAddSignatureTokenRepository()
  const sut = new AddSignatureTokenUseCase(encrypterStub, addSignatureTokenRepositoryStub)
  return {
    sut,
    encrypterStub,
    addSignatureTokenRepositoryStub
  }
}
describe('AddSignatureToken Usecase', () => {
  it('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(account.id)
    const encryptParam = JSON.stringify({ id: account.id })
    expect(encryptSpy).toHaveBeenCalledWith(encryptParam)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(account.id)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddSignatureTokenRepository with correct values ', async () => {
    const { sut, addSignatureTokenRepositoryStub } = makeSut()
    const updateTokenSpy = jest.spyOn(addSignatureTokenRepositoryStub, 'add')
    await sut.add(account.id)
    expect(updateTokenSpy).toHaveBeenCalledWith(
      await mockEncrypter().encrypt(''),
      SignatureTypes.account,
      SignatureSubjectTypes.emailConfirmation
    )
  })

  it('Should throw if AddSignatureTokenRepository throws', async () => {
    const { sut, addSignatureTokenRepositoryStub } = makeSut()
    jest.spyOn(addSignatureTokenRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(account.id)
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if AddSignatureTokenRepository return null', async () => {
    const { sut, addSignatureTokenRepositoryStub } = makeSut()
    jest.spyOn(addSignatureTokenRepositoryStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const promise = sut.add(account.id)
    await expect(promise).rejects.toThrow()
  })

  it('Should return SignatureToken model on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(account.id)
    expect(response.token).toBe(mockSignatureTokenModel(SignatureTypes.account).token)
  })
})
