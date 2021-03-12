import { StoreModel } from '@/domain/models/store-model'
import { AddStoreParameters } from '../presentation/protocolls'

export const mockStoreModel = (): StoreModel => ({
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
  geoLocalization: { lat: 0, lng: 0 },
  usersAdmin: ['user_01', 'user_05']
})

export const mockAddStoreParams = (): AddStoreParameters => ({
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
  geoLocalization: { lat: 0, lng: 0 },
  userId: 'any_user_id'
})
