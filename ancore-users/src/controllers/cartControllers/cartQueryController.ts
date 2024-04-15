import CartQueryService from '../../services/cartService/cartQueryService';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import * as PT from '../../types/proto';

export default class CartQueryController {
  private readonly cartQueryService: CartQueryService;

  constructor(cartQueryService: CartQueryService) {
    this.cartQueryService = cartQueryService;
  }

  public async getUserCart (call: PT.UserProducts, callback: PT.UserProductsResponse) {
    try {
      const {  id } = call.request;
      if (!id) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');

      const cart = await this.cartQueryService.getCart(id);

      if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

      callback(null, cart);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}