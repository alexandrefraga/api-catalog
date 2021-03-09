export type Address = {
  street: string
  number: string
  city: string
}

export type StoreModel = {
  id: string
  company: string
  tradingName: string
  description: string
  address: Address
  email: string
  phoneNumber: string[]
  geoLocalization: { lat: number, lng: number }
  usersAdmin: string[]
}
