import { Role } from '@/domain/models/account-model'
import { AddStore } from '@/domain/usecases/store/add-store'
import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'
import { DataInUseError } from '@/presentation/errors/data-in-use-error'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { storeKey } from '@/presentation/helpers/key-helper'
import { AddStoreParameters, EmailValidator, HttpResponse, Validation } from '@/presentation/protocolls'
import { ValidationsBuilder } from '@/presentation/validations'
import { Controller } from '@/presentation/controllers/controller'

export class AddStoreController extends Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addStore: AddStore,
    private readonly addKeyInAccount: AddKeyInAccount
  ) { super() }

  async perform (data: AddStoreParameters): Promise<HttpResponse> {
    const addStoreParams = Object.assign({}, data)
    delete addStoreParams.userId
    const store = await this.addStore.add(addStoreParams)
    if (!store) {
      return forbidden(new DataInUseError(''))
    }
    await this.addKeyInAccount.add(data.userId, storeKey(store.id, Role.storeAdmin))
    return success(store)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .requiredFields([
        'company', 'tradingName', 'description', 'address',
        'geoLocalization', 'userId', 'phoneNumber', 'email'
      ])
      .emailValidation('email', this.emailValidator)
      .phoneNumberArrayValidation('phoneNumber', 1)
      .build()
  }
}
