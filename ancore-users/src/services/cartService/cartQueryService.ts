import { IProductModel } from '../../types/products';
import CartQueryRepository from '../../models/userCart/CartQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class CartQueryService {
  private readonly cartQueryRepository: CartQueryRepository;

  constructor(cartQueryRepository: CartQueryRepository) {
    this.cartQueryRepository = cartQueryRepository;
  }

  public async getCart(userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');
      const cart = await this.cartQueryRepository.getCart(userId);

      if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

      return cart;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async getTotalPrice (userId: string): Promise<number> {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');

      const cart = await this.cartQueryRepository.getTotalPrice(userId);

      if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

      return cart;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async getUserPaidProducts (userId: string): Promise<IProductModel[]> {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');

      const cart = await this.cartQueryRepository.getPaidProducts(userId);

      if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

      return cart;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}