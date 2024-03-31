import CartCommandService from '../../services/cartService/cartCommandService';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import * as PT from '../../types/proto';


export default class CartCommandController {
  private cartCommandService: CartCommandService;

  constructor(cartCommandService: CartCommandService) {
    this.cartCommandService = cartCommandService;
  }

  public async addProductToCart(call: PT.AddProduct, callback: PT.AddProductResponse) {
    try {
      const { productId, userId } = call.request;
      if (!productId || !userId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid arguments');
      }

      const newProduct = await this.cartCommandService.addProduct(userId, productId);

      callback(null, newProduct);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async removeProductFromCart(call: PT.RemoveProduct, callback: PT.RemoveProductResponse) {
    try {
      const { productId, userId } = call.request;
      if (!productId || !userId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid arguments');
      }

      const newProduct = await this.cartCommandService.removeProduct(userId, productId);

      callback(null, newProduct);  
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async deleteProductFromCart (call: PT.DeleteProduct, callback: PT.DeleteProductResponse) {
    try {
      const { productId, userId } = call.request;
      if (!productId || !userId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid arguments');
      }

      const productDeleted = await this.cartCommandService.deleteProduct(userId, productId);

      callback(null, productDeleted);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}