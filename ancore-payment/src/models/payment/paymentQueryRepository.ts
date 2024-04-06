import { IUserCart } from '../../types/userCart';
import { sendPurchaseEmail } from '../../mailService/mail/mail.services';
import { sendRejectedEmail } from '../../mailService/mail/mail.services';
import UserModel from '../../database/sql/tables/userModel';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class PaymentQueryRepository {
  async sendPurchaseEmail(userId: string, cart: IUserCart): Promise<void> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

    await sendPurchaseEmail(user.email, user.userName, cart);
  }

  async sendRejectedEmail(userId: string, cart: IUserCart): Promise<void> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

    await sendRejectedEmail(user.email, user.userName, cart);
  }
}