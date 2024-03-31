import WhitelistQueryService from '../../services/whitelist/whitelistQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import * as PT from '../../types/proto';

export default class WhitelistQueryController {
  private readonly whitelistQueryService: WhitelistQueryService;

  constructor(whiteListQueryService: WhitelistQueryService) {
    this.whitelistQueryService = whiteListQueryService;
  }

  public async getUserWhiteLis(call: PT.GetAllWhiteList, callback: PT.GetAllWhiteListResponse) {
    try {
      const { id } = call.request;
      if (!id) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid arguments');

      const whitelist = await this.whitelistQueryService.getWhiteList(id);

      callback(null, { products: whitelist });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}