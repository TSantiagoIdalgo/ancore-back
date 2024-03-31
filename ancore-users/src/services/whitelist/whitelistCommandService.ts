import WhitelistCommandRepository from '../../models/whiteList/whitelistCommandRepository';
import GRPCErrorHandler from '../../helpers/error';
import { IWhiteList } from '../../types/whitelist';
import * as grpc from '@grpc/grpc-js';

export default class WhitelistCommandService {
  private readonly whitelistCommandRepository: WhitelistCommandRepository;

  constructor(whitelistCommandRepository: WhitelistCommandRepository) {
    this.whitelistCommandRepository = whitelistCommandRepository;
  }

  public async createWhitelist(list: IWhiteList) {
    try {
      if (!list.userId || !list.productId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');
      }
      return await this.whitelistCommandRepository.create(list);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }

  public async removeProduct (list: IWhiteList) {
    try {
      if (!list.userId || !list.productId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');
      }
      return await this.whitelistCommandRepository.remove(list);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }
}