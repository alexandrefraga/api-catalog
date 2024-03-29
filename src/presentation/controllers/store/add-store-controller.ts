import { Controller, HttpResponse } from '@/presentation/controllers/controller'
import { Role } from '@/domain/models/account-model'
import { AddStore } from '@/domain/usecases/store/add-store'
import { AddKeyInAccount } from '@/domain/usecases/account/add-key-in-account'
import { DataInUseError } from '@/presentation/errors/data-in-use-error'
import { forbidden, success } from '@/presentation/helpers/http-helper'
import { storeKey } from '@/presentation/helpers/key-helper'
import { EmailValidator, Validation } from '@/presentation/protocolls'
import { ValidationsBuilder } from '@/presentation/validations'

type AddStoreParams = {
  company: string
  tradingName: string
  description: string
  address: {
    street: string
    number: string
    city: string
  }
  email: string
  phoneNumber: string[]
  geoLocalization: { lat: number, lng: number }
  userId: string
}

export class AddStoreController extends Controller<AddStoreParams> {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addStore: AddStore,
    private readonly addKeyInAccount: AddKeyInAccount
  ) { super() }

  async perform (request: AddStoreParams): Promise<HttpResponse> {
    const store = await this.addStore.add(request)
    if (!store) {
      return forbidden(new DataInUseError(''))
    }
    await this.addKeyInAccount.add(request.userId, storeKey(store.id, Role.storeAdmin))
    return success(store)
  }

  override buildValidators (httpRequest: any): Validation[] {
    return ValidationsBuilder.of(httpRequest)
      .stringValidations({ field: 'company', minLength: 3, maxLength: 50, required: true })
      .stringValidations({ field: 'tradingName', minLength: 2, maxLength: 20, required: true })
      .stringValidations({ field: 'description', minLength: 10, maxLength: 200, required: true })
      .stringValidations({ field: 'userId', minLength: 1, maxLength: 30, required: true })
      .requiredField('address')
      .requiredField('geoLocalization')
      .emailValidation('email', this.emailValidator)
      .phoneNumberArrayValidation('phoneNumber', 1)
      .build()
  }
}
