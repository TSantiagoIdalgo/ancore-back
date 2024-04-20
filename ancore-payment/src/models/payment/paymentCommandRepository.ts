import Stripe from 'stripe';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import { IProductModel } from '../../types/products';
import ProductSchema from '../../database/nosql/schemas/productSchema';

export default class PaymentCommandRepository {
  private readonly stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createPaymentIntent(userId: string): Promise<string> {
    const userCart = await this.getCart(userId);

    const products = userCart.products.map(product => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.mainImage]
          },
          unit_amount: product.price * 100
        },
        quantity: product.amount
      };
    });

    const payment = await this.stripe.checkout.sessions.create({
      line_items: products,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      customer_email: userId,
      metadata: { cartId: userCart.id }
    });
    if (!payment.url) {
      throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Payment intent creation failed');
    }

    return payment.url;
  }
  
  async paymentAccepted (userId: string) {
    const cart = await this.getCart(userId);
    const acceptCart = await UserCartSchema.findOneAndUpdate(
      { userId, id: cart.id },
      { isPaid: true }, 
      { new: true }
    );
    if (!acceptCart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

    acceptCart.products.forEach(async (product) => {
      const productFind = await ProductSchema.findOne({ id: product.productId });
      if (productFind) {
        productFind.stock -= product.amount;
        await productFind.save();
      }
    });

    return { total: acceptCart.total, products: cart.products, isPaid: acceptCart.isPaid };
  }

  private async getCart (userId: string)  {
    const cart = await UserCartSchema.findOne({ userId, isPaid: false }).lean().exec();
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

    const products: IProductModel[] = [];
    await Promise.all(cart.products.map(async (product) => {
      const productFind = await ProductSchema.findOne({ id: product.productId }).lean().exec();
      if (productFind !== null) products.push({ ...productFind, amount: product.amount });
    }));

    return { ...cart, products };
  }
}