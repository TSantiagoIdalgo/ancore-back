import ProductCommandRepository from '../../models/products/productCommandRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import { IProductModel } from '../../types/products';


export default class ProductCommandService {
  private readonly productCommandRepository: ProductCommandRepository;

  constructor(productCommandRepository: ProductCommandRepository) {
    this.productCommandRepository = productCommandRepository;
  }

  public async createProduct(product: IProductModel) {
    try {
      return await this.productCommandRepository.create(product);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async updateProduct(productId: string, product: IProductModel) {
    try {
      if (!productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid product id');
      return await this.productCommandRepository.update(productId, product);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async deleteProduct(productId: string) {
    try {
      if (!productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid product id');
      return await this.productCommandRepository.delete(productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}