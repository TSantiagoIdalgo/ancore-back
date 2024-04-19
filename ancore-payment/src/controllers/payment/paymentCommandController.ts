import PaymentCommandService from '../../services/payment/paymentCommandService';
import GRPCErrorHandler from '../../helpers/error';
import * as PT from '../../types/proto';
import * as grpc from '@grpc/grpc-js';

export default class PaymentCommandController {
  private paymentCommandService: PaymentCommandService;

  constructor(paymentCommandService: PaymentCommandService) {
    this.paymentCommandService = paymentCommandService;
  }

  public async createPayment (call: PT.CreatePayment, callback: PT.CreatePaymentResponse) {
    try {
      const { id } = call.request;
      if (!id) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');
    
      const payment = await this.paymentCommandService.createPayment(id);
      if (!payment) throw new GRPCErrorHandler(grpc.status.INTERNAL, 'INTERNAL_SERVER_ERROR');

      callback(null, { paymentURL: payment });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }  

  public async acceptPayment (call: PT.AcceptPayment, callback: PT.AcceptPaymentResponse) {
    try {
      const { id } = call.request;

      if (!id) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');

      const payment = await this.paymentCommandService.acceptPayment(id);

      callback(null, payment);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}