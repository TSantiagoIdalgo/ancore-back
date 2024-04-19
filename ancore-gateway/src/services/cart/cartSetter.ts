import { UserProduct } from '../../../proto/out/UserPackage/UserProduct';
import { UserProductServiceClient } from '../../../proto/out/UserPackage/UserProductService';
import { ActionCart } from '../../types/cart/userCart';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class CartSetter{
  private readonly client: UserProductServiceClient;

  constructor(client: UserProductServiceClient) {
    this.client = client;
  }

  async update(action: ActionCart, userId: string, productId: string): Promise<UserProduct> {
    return new Promise<UserProduct>((res, rej) => {
      const stream = this.client.updateCart();
      stream.on('data', (response: UserProduct) => {
        res(response);
      });

      stream.on('error', (error: grpc.ServiceError) => {
        rej(new GRPCErrorHandler(error.code, error.message));
      });

      stream.write({ action, productId, userId });
      stream.on('end', () => {
        stream.end();
      });
    });
  }

}