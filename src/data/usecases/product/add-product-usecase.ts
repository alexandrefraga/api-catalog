import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { AddProduct, AddProductUseCaseParams } from '@/domain/usecases/product/add-product'

export class AddProductUseCase implements AddProduct {
  constructor (
    private readonly loadStoreByIdRepository: LoadStoreByIdRepository
  ) {}

  async add (data: AddProductUseCaseParams): Promise<ProductModel | Error> {
    await this.loadStoreByIdRepository.loadById(data.storeId)
    return Promise.resolve(null)
  }
}
