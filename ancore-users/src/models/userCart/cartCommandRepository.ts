import { IUserCart } from '../../types/userCart';
import { IProductModel } from '../../types/products';
import GRPCErrorHandler from '../../helpers/error';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import ProductSchema from '../../database/nosql/schemas/productSchema';
import * as grpc from '@grpc/grpc-js';

export default class CartCommandRepository {
  async addProduct (userId: string, productId: string) {
    let cart = await UserCartSchema.findOne({ userId, isPaid: false });
    const product = await ProductSchema.findOne({ id: productId });

    if (!product) {
      throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    }
    
    if (!cart) {
      cart = await UserCartSchema.create({ 
        userId, 
        products: [{ productId, amount: 0 }], 
        total: 0
      });
    }

    const productFind = cart.products.findIndex(p => p.productId === productId);

    if (cart.products.length > 0 && productFind !== -1) {
      if (cart.products[productFind].amount >= product.stock) {
        throw new GRPCErrorHandler(grpc.status.FAILED_PRECONDITION, 'Product out of stock');
      }
    }

    if (productFind !== -1) cart.products[productFind].amount++;
    else cart.products.push({ productId, amount: 1 });

    cart.total += product.price;
    await cart.save();
    
    return { ...cart.toObject(), products: await this.getProduct(cart) };

  }
    
  async removeProduct (userId: string, productId: string) {

    const cart = await UserCartSchema.findOne({ userId, isPaid: false });
    const product = await ProductSchema.findOne({ id: productId });
    
    if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');
    
    const productIndex = cart.products.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    
    const productAmount = cart.products[productIndex].amount;
    if (productAmount > 1) cart.products[productIndex].amount--;
    else cart.products.splice(productIndex, 1);
    cart.total -= product.price;
      
    await cart.save();
      
    if (cart.products.length === 0) await this.deleteCart(userId);
    return { ...cart.toObject(), products: await this.getProduct(cart) };

  }
    
  async deleteProduct (userId: string, productId: string) {

    const cart = await UserCartSchema.findOne({ userId, isPaid: false });
    const product = await ProductSchema.findOne({ id: productId });
    
    if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');
    if (cart.products.length === 0) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

    const productIndex = cart.products.findIndex(p => p.productId === productId);
      
    cart.total -= (product.price * cart.products[productIndex].amount);
    cart.products = cart.products.filter(p => p.productId !== productId);
    await cart.save();

    if (cart.products.length === 1) await this.deleteCart(userId);
    return { ...cart.toObject(), products: await this.getProduct(cart) };
  }

  private async getProduct (cart: IUserCart) {
    const products: IProductModel[] = [];
    await Promise.all(cart.products.map(async (product) => {
      const productFind = await ProductSchema.findOne({ id: product.productId }).lean().exec();
      if (productFind !== null) products.push({ ...productFind, amount: product.amount });
    }));
  
    return products;
  }

  private async deleteCart (userId: string) {
    await UserCartSchema.deleteOne({ userId });
  }
}