import { IWhiteList } from '../../types/whitelist';
import WhiteList from '../../database/sql/tables/whitelistSchema';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class WhitelistCommandRepository {
  async create(list: IWhiteList): Promise<IWhiteList> {
    let whiteList = await WhiteList.findOne({
      where: { productId: list.productId, userId: list.userId }
    });

    if (!whiteList) {
      whiteList = await WhiteList.create({ 
        userId: list.userId, 
        productId: list.productId 
      });
    }

    return whiteList;
  }

  async remove(list: IWhiteList): Promise<IWhiteList> {
    const whiteList = await WhiteList.findOne({
      where: { productId: list.productId, userId: list.userId }
    });

    if (!whiteList) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'List not found');

    await WhiteList.destroy({ where: { productId: list.productId, userId: list.userId } });

    return whiteList;
  }
}