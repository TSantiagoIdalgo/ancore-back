import { IProductModel } from '../../types/products';
import ProductCommandService from '../../services/productService/productCommandService';
import GRPCErrorHandler from '../../helpers/error';
import * as PT from '../../types/proto';
import * as grpc from '@grpc/grpc-js';

export default class ProductCommandController {
  private readonly productCommandService: ProductCommandService;

  constructor(productCommandService: ProductCommandService) {
    this.productCommandService = productCommandService;
  }

  async createProduct(call: PT.TCreateProduct, callback: PT.TCreateProductResponse) {
    try {
      const product = call.request as IProductModel;
      const newProduct = await this.productCommandService.createProduct(product);
      
      callback(null, newProduct);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  async updateProduct(call: PT.TUpdateProduct, callback: PT.TUpdateProductResponse) {
    try {
      const { productId, product } = call.request;
      if (!productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Product id is required');
    
      const updatedProduct = await this
        .productCommandService
        .updateProduct(productId, product as IProductModel);

      if (!updatedProduct) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');

      callback(null, updatedProduct);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  async deleteProduct(call: PT.TDeleteProduct, callback: PT.TDeleteProductResponse) {
    try {
      const { productId } = call.request;
      if (!productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Product id is required');

      const product = await this.productCommandService.deleteProduct(productId);
      if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');

      callback(null, product);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}