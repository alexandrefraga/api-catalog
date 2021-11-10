import { InvalidParamError } from '@/data/errors'
import { LoadProductByStoreRepository, LoadStoreByIdRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'

export class LoadProductsByStoreUseCase implements LoadProductsByStore {
  constructor (
    private readonly loadStoreByIdRepository: LoadStoreByIdRepository,
    private readonly loadProductByStoreRepository: LoadProductByStoreRepository
  ) {}

  async loadByStore (data: { storeId: string }): Promise<ProductModel[] | Error> {
    const store = await this.loadStoreByIdRepository.loadById(data.storeId)
    if (!store) {
      return new InvalidParamError('storeId')
    }
    const products = await this.loadProductByStoreRepository.loadByStore(store.id)
    return products
  }
}
