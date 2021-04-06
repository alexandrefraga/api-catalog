import { InvalidParamError } from '@/data/errors'
import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { LoadProductsByStore } from '@/domain/usecases/product/load-product-by-store'

export class LoadProductsByStoreUseCase implements LoadProductsByStore {
  constructor (
    private readonly loadStoreByIdRepository: LoadStoreByIdRepository
  ) {}

  async loadByStore (storeId: string): Promise<ProductModel[] | Error> {
    const store = await this.loadStoreByIdRepository.loadById(storeId)
    if (!store) {
      return new InvalidParamError('storeId')
    }
    return null
  }
}
