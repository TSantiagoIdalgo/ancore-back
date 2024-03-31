import WhitelistCommandService from '../../services/whitelist/whitelistCommandService';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import * as PT from '../../types/proto';
import { IWhiteList } from '../../types/whitelist';

export default class WhitelistCommandController {
  private whitelistCommandService: WhitelistCommandService;

  constructor(whitelistCommandService: WhitelistCommandService) {
    this.whitelistCommandService = whitelistCommandService;
  }

  public async addProductToWhiteList(call: PT.AddToWhiteList, callback: PT.AddToWhiteListResponse) {
    try {
      const { userId, productId } = call.request;
      if (!userId || !productId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid arguments');
      }

      const whitelist = await this.whitelistCommandService.createWhitelist({ userId, productId } as IWhiteList);

      callback(null, whitelist);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async removeProductFromWhitelist (call: PT.RemoveFromWhiteList, callback: PT.RemoveFromWhiteListResponse) {
    try {
      const { productId, userId } = call.request;
      if (!userId || !productId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid arguments');
      }

      const whitelist = await this.whitelistCommandService.removeProduct({ userId, productId } as IWhiteList);

      callback(null, whitelist);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}