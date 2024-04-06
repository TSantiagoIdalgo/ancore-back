import Stripe from 'stripe';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import { IUserCart } from '../../types/userCart';

export default class PaymentCommandRepository {
  private readonly stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createPaymentIntent(userId: string): Promise<string> {
    const userCart = await UserCartSchema.findOne({ userId }).populate('products') as IUserCart|null;
    if (!userCart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

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
  
  async paymentAccepted (userId: string, cartId: string): Promise<IUserCart> {
    const userCart = await UserCartSchema.findOneAndUpdate(
      { userId, id: cartId },
      { isPaid: true }, 
      { new: true }
    );
    if (!userCart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');

    return userCart;
  }
}