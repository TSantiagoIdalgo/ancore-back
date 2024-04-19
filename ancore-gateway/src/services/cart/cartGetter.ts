import { Products__Output } from '../../../proto/out/UserPackage/Products';
import { UserProductServiceClient } from '../../../proto/out/UserPackage/UserProductService';
import GRPCErrorHandler from '../../helpers/error';

export default class CartGetter {
  private readonly client: UserProductServiceClient;

  constructor(client: UserProductServiceClient) {
    this.client = client;
  }

  async getCart(id: string): Promise<Products__Output> {
    return new Promise<Products__Output>((res, rej) => {
      this.client.getAllProducts({ id }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }
}