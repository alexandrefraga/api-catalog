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

  async add (request: AddProductUseCaseParams): Promise<ProductModel | Error> {
    const data = this.map(request)
    const { trademark, reference, storeId } = data
    const store = await this.loadStoreByIdRepository.loadById(storeId)
    if (!store) {
      return new InvalidParamError('storeId')
    }
    const existProduct = await this.loadProductByDataRepository.loadByData({ trademark, reference, storeId })
    if (existProduct) {
      return new DataInUseError('trademark and reference')
    }
    const product = await this.addProductRepository.add(data)
    return Object.assign({}, data, product)
  }

  map (request: AddProductUseCaseParams): AddProductUseCaseParams {
    const data: AddProductUseCaseParams = {
      description: request.description,
      trademark: request.trademark,
      reference: request.reference,
      storeId: request.storeId
    }
    if (request.details) data.details = request.details
    if (request.price) data.price = request.price

    return data
  }
}
