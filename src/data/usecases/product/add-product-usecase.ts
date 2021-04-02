import { ProductModel } from '@/domain/models/product-model'
import { AddProduct, AddProductUseCaseParams } from '@/domain/usecases/product/add-product'
import { AddProductRepository, LoadStoreByIdRepository, LoadProductByDataRepository } from '@/data/protocols/db'
import { DataInUseError, InvalidParamError } from '@/data/errors'

export class AddProductUseCase implements AddProduct {
  constructor (
    private readonly loadStoreByIdRepository: LoadStoreByIdRepository,
    private readonly loadProductByDataRepository: LoadProductByDataRepository,
    private readonly addProductRepository: AddProductRepository
  ) {}

  async add (data: AddProductUseCaseParams): Promise<ProductModel | Error> {
    const store = await this.loadStoreByIdRepository.loadById(data.storeId)
    if (!store) {
      return new InvalidParamError('storeId')
    }
    const { trademark, reference, storeId } = data
    const existProduct = await this.loadProductByDataRepository.loadByData({ trademark, reference, storeId })
    if (existProduct) {
      return new DataInUseError('trademark and reference')
    }
    await this.addProductRepository.add(data)
    return null
  }
}
