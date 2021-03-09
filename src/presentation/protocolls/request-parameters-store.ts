type Address = {
  street: string
  number: string
  city: string
}

export type AddStoreParameters = {
  company: string
  tradingName: string
  description: string
  address: Address
  email: string
  phoneNumber: string[]
  geoLocalization: { lat: number, lng: number }
  userId: string
}
