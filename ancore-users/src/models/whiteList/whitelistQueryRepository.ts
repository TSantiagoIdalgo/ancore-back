import { IProductModel } from '../../types/products';
import WhiteList from '../../database/sql/tables/whitelistSchema';
import ProductSchema from '../../database/nosql/schemas/productSchema';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class WhitelistQueryRepository {
  async getAll(userId: string) {
    const whiteList = await WhiteList.findAll({ where: { userId } });
    if (whiteList.length === 0) {
      throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'No products in whitelist');
    }

    const whiteListProducts = await Promise.all(whiteList.map(async (item) => {
      return await ProductSchema.findOne({ id: item.productId }) as IProductModel;
    }));

    return whiteListProducts;
  }
}