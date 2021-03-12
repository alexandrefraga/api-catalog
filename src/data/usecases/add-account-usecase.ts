import { AccountModel } from '@/domain/models/account-model'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { MailService } from '../protocols/service'
import { Encrypter, Hasher } from '../protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository, UpdateTokenRepository } from '../protocols/db'

export class AddAccountUseCase implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository,
    private readonly mailService: MailService,
    private readonly mailTemplateName: string
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    const emailInUse = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (!emailInUse) {
      const passwordHashed = await this.hasher.hash(account.password)
      const accountData = await this.addAccountRepository.add(Object.assign(account, { password: passwordHashed }))
      const token = await this.encrypter.encrypt(JSON.stringify({ id: accountData.id }))
      const inserted = await this.updateTokenRepository.updateToken(token, accountData.id)
      if (!inserted) {
        throw new Error()
      }
      await this.mailService.send({
        mailTo: `${accountData.name}<${accountData.email}>`,
        subject: `Account confirmation to ${accountData.name}`,
        template: {
          name: this.mailTemplateName,
          props: {
            account: accountData,
            token
          }
        }
      })
      return accountData
    }
    return null
  }
}