import ProductQueryService from '../../services/productService/productQueryService';
import GRPCErrorHandler from '../../helpers/error';
import * as PT from '../../types/proto';
import * as grpc from '@grpc/grpc-js';

export default class ProductQueryController {
  private productQueryService: ProductQueryService;

  constructor(productQueryService: ProductQueryService) {
    this.productQueryService = productQueryService;
  }

  public async getAllProduct (call: PT.TGetAllProducts, callback: PT.TGetAllProductsResponse) {
    try {
      const { page, size } = call.request;
      const products = await this.productQueryService.getProducts(size, page);

      if (products.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Products not found');
      }

      callback(null, { products });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getProductById (call: PT.TGetProductById, callback: PT.TGetProductByIdResponse) {
    try {
      const { productId } = call.request;
      if (!productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid product id');

      const product = await this.productQueryService.getProductById(productId);

      if (!product) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
      }

      callback(null, product);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getTotalPages (call: PT.TGetAllPages, callback: PT.TGetAllPagesResponse) {
    try {
      const { size } = call.request;
      if (!size || size < 1) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid size');

      const totalPages = await this.productQueryService.getTotalPages(size);

      callback(null, { totalPages });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}