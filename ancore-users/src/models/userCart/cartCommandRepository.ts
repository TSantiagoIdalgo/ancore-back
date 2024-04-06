import { IUserCart } from '../../types/userCart';
import GRPCErrorHandler from '../../helpers/error';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import ProductSchema from '../../database/nosql/schemas/productSchema';
import * as grpc from '@grpc/grpc-js';

export default class CartCommandRepository {
  async addProduct (userId: string, productId: string): Promise<IUserCart> {
    let cart = await UserCartSchema.findOne({ userId, isPaid: false });
    const product = await ProductSchema.findOne({ id: productId });
    if (!product) {
      throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    }
    if (!cart) {
      cart = await UserCartSchema.create({ userId, products: [productId] });
    }
    
    const productFind = cart.products.findIndex(p => p.productId === productId);
    
    if (productFind !== -1) cart.products[productFind].amount++;
    else cart.products.push({ productId, amount: 1 });
    
    cart.total += product.price;
    
    await cart.save();
    
    return cart;
  }
    
  async removeProduct (userId: string, productId: string): Promise<IUserCart> {
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
      
    return cart;
  }
    
  async deleteProduct (userId: string, productId: string): Promise<IUserCart> {
    const cart = await UserCartSchema.findOne({ userId, isPaid: false });
    const product = await ProductSchema.findOne({ id: productId });
    
    if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');
    
    cart.products = cart.products.filter(p => p.productId !== productId);
    
    cart.total -= product.price;
    await cart.save();
    
    return cart;
  }
}