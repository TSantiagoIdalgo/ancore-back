import { Products__Output } from '../../../proto/out/ProductsPackage/Products';
import { UserFavsServiceClient } from '../../../proto/out/UserPackage/UserFavsService';
import GRPCErrorHandler from '../../helpers/error';

export default class WhitelistGetter {
  private readonly client: UserFavsServiceClient;

  constructor (client: UserFavsServiceClient) {
    this.client = client;
  }

  getWhitelist (userId: string) {
    return new Promise<Products__Output>((res, rej) => {
      this.client.getAllUserFavs({ id: userId }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err?.code, err?.message));
          return;
        }
        res(result);
      });
    });
  }
}