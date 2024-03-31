import ProductQueryRepository from '../../models/products/productQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class ProductQueryService {
  private readonly productQueryRepository: ProductQueryRepository;

  constructor (productQueryRepository: ProductQueryRepository) {
    this.productQueryRepository = productQueryRepository;
  }

  public async getProducts () {
    try {
      const products = await this.productQueryRepository.getAll();

      if (products.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Products not found');
      }

      return products;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async getProductById (productId: string) {
    try {
      const product = await this.productQueryRepository.getById(productId);

      if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');

      return product;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}