import GRPCErrorHandler from '../../helpers/error';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import * as grpc from '@grpc/grpc-js';
import { IProductModel } from '../../types/products';
import ProductSchema from '../../database/nosql/schemas/productSchema';

export default class CartQueryRepository {
  async getCart (userId: string)  {
    const cart = await UserCartSchema.findOne({ userId, isPaid: false }).lean().exec();
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');
    
    const products: IProductModel[] = [];
    await Promise.all(cart.products.map(async (product) => {
      const productFind = await ProductSchema.findOne({ id: product.productId }).lean().exec();
      if (productFind !== null) products.push({ ...productFind, amount: product.amount });
    }));

    return { ...cart, products };
  }

  async getTotalPrice (userId: string): Promise<number> {
    const cart = await UserCartSchema.findOne({ userId, isPaid: false });
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

    return cart.total;
  }
}