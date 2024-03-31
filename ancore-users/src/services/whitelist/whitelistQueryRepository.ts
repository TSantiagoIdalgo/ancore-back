import WhitelistQueryRepository from '../../models/whiteList/whitelistQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class WhitelistQueryService {
  private readonly whitelistQueryRepository: WhitelistQueryRepository;

  constructor(whitelistQueryRepository: WhitelistQueryRepository) {
    this.whitelistQueryRepository = whitelistQueryRepository;
  }

  public async getWhiteList(userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');

      const whiteList = await this.whitelistQueryRepository.getAll(userId);
      if (whiteList.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Not found');
      }

      return whiteList;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }
}