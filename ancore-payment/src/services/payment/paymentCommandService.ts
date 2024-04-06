import PaymentCommandRepository from '../../models/payment/paymentCommandRepository';
import PaymentQueryRepository from '../../models/payment/paymentQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class PaymentCommandService {
  private readonly paymentCommandRepository: PaymentCommandRepository;
  private readonly paymentQueryRepository: PaymentQueryRepository;

  constructor(paymentCommandRepository: PaymentCommandRepository, paymentQueryRepository: PaymentQueryRepository) {
    this.paymentCommandRepository = paymentCommandRepository;
    this.paymentQueryRepository = paymentQueryRepository;
  }

  public async createPayment(userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');
      
      return await this.paymentCommandRepository.createPaymentIntent(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }  

  public async acceptPayment (userId: string, cartId: string) {
    try {
      if (!userId || !cartId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');
      }

      const userCart = await this.paymentCommandRepository.paymentAccepted(userId, cartId);

      if (!userCart.isPaid) {
        await this.paymentQueryRepository.sendRejectedEmail(userId, userCart);
        throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
      }

      await this.paymentQueryRepository.sendPurchaseEmail(userId, userCart);
      return userCart;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }
}