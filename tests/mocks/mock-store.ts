import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParams } from '@/domain/usecases/store/add-store'
import { AddStoreParameters } from '@/presentation/protocolls'

export const mockStoreModel = (): StoreModel => ({
  id: 'store_id',
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

export const mockAddStoreParams = (): AddStoreParams => ({
  company: 'any_company',
  tradingName: 'any_trading_name',
  description: 'any_description',
  address: {
    street: 'any_street',
    number: 'any_number',
    city: 'any_city'
  },
  email: 'any_email@mail.com',
  phoneNumber: ['(99)999999999', '(88)888888888'],
  geoLocalization: { lat: 0, lng: 0 }
})

export const mockAddStoreParameters = (): AddStoreParameters => {
  return Object.assign(mockAddStoreParams(), { userId: 'any_id' })
}
