import { StoreModel } from '@/domain/models/store-model'
import { AddStore, AddStoreParams } from '@/domain/usecases/add-store'

export const mockStoreModel = ({
  id: 'any_id',
  company: 'any_company',
  tradingName: 'any_trading_name',
  description: 'any_description',
  address: {
    street: 'any_street',
    number: 'any_number',
    city: 'any_city'
  },
  email: 'any_email',
  phoneNumber: ['(99)999999999', '(88)888888888'],
  geoLocalization: { lat: 0, lng: 0 }
})

export const mockAddStoreUseCase = (): AddStore => {
  class DbAddStoreStub implements AddStore {
    async add (data: AddStoreParams): Promise<StoreModel> {
      return null
    }
  }
  return new DbAddStoreStub()
}
