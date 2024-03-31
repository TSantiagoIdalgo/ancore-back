import { IUserCart } from '../../types/userCart';
import GRPCErrorHandler from '../../helpers/error';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import * as grpc from '@grpc/grpc-js';

export default class CartQueryRepository {
  async getCart (userId: string): Promise<IUserCart>  {
    return await UserCartSchema.findOne({ userId }).populate('products') as IUserCart;
  }

  async getTotalPrice (userId: string): Promise<number> {
    const cart = await UserCartSchema.findOne({ userId });
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

    return cart.total;
  }
}