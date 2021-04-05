export type AddProductControllerParams = {
  description: string
  details?: string
  trademark: string
  reference: string
  price?: number
  storeId: string
}

export type LoadProductsByStoreIDControllerParams = {
  storeId: string
}
