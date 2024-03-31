import CartCommandRepository from '../../models/userCart/cartCommandRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class CartCommandService {
  private readonly cartCommandRepository: CartCommandRepository;

  constructor(cartCommandRepository: CartCommandRepository) {
    this.cartCommandRepository = cartCommandRepository;
  }

  public async addProduct(userId: string, productid: string) {
    try {
      if (!userId || !productid) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');
      }

      return await this.cartCommandRepository.addProduct(userId, productid);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async removeProduct (userId: string, productId: string) {
    try {
      if (!userId || !productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');

      return await this.cartCommandRepository.removeProduct(userId, productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async deleteProduct (userId: string, productId: string) {
    try {
      if (!userId || !productId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');
      }

      return await this.cartCommandRepository.deleteProduct(userId, productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}