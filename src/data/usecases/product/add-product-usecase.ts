import { LoadStoreByIdRepository } from '@/data/protocols/db'
import { ProductModel } from '@/domain/models/product-model'
import { AddProduct, AddProductUseCaseParams } from '@/domain/usecases/product/add-product'
import { InvalidParamError } from '@/data/errors'

export class AddProductUseCase implements AddProduct {
  constructor (
    private readonly loadStoreByIdRepository: LoadStoreByIdRepository
  ) {}

  async add (data: AddProductUseCaseParams): Promise<ProductModel | Error> {
    const store = await this.loadStoreByIdRepository.loadById(data.storeId)
    if (!store) {
      return new InvalidParamError('storeId')
    }
    return null
  }
}
