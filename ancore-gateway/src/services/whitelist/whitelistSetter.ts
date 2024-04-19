import { Favorite__Output } from '../../../proto/out/UserPackage/Favorite';
import { UserFavsServiceClient } from '../../../proto/out/UserPackage/UserFavsService';
import GRPCErrorHandler from '../../helpers/error';

export default class WhitelistSetter {
  private readonly client: UserFavsServiceClient;

  constructor(client: UserFavsServiceClient) {
    this.client = client;
  }

  addProduct (userId: string, productId: string) {
    return new Promise<Favorite__Output>((res, rej) => {
      this.client.addToFavs({ userId, productId }, (err, result) => {
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

  removeProduct (userId: string, productId: string) {
    return new Promise<Favorite__Output>((res, rej) => {
      this.client.deleteFav({ userId, productId }, (err, result) => {
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