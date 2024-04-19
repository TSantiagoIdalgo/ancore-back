import { Request, Response } from 'express';
import { paymentClient } from '../../config/clients';
import { ErrorDefs } from '../../types/error';
import { PaymentURL__Output } from '../../../proto/out/PaymentPackage/PaymentURL';
import { tokenVerify } from '../../helpers/token';
import { UserProduct__Output } from '../../../proto/out/UserPackage/UserProduct';

export default class PaymentMethods {
  private readonly client = paymentClient;

  constructor() {
    this.client = paymentClient;
  }

  public newPayment = async (req: Request, res: Response) => {
    try {
      const userId = tokenVerify(req);

      if (!userId) throw new Error(ErrorDefs.INVALID_INPUT);

      const result = await this.createPayment(userId);
      
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) res.status(400).send(error.message);
      else res.status(400).send(ErrorDefs.INTERNAL_ERROR);
    }
  };

  public acceptPaymentMethod = async (req: Request, res: Response) => {
    try {
      if (req.body.type !== 'checkout.session.completed') {
        throw new Error(ErrorDefs.INVALID_CREDENTIALS);
      }

      const userId = req.body.data.object.customer_email;

      const result = await this.acceptPayment(userId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) res.status(400).json({ error: error.message });
      else res.status(400).send(ErrorDefs.INTERNAL_ERROR);
    }
  };

  private createPayment (id: string) {
    return new Promise<PaymentURL__Output>((res, rej) => {
      this.client.createPayment({ id }, (err, result) => {
        if (err || !result) {
          rej(new Error(err?.message));
          return;
        }
        res(result);
      });
    });
  }

  private acceptPayment (userId: string) {
    return new Promise<UserProduct__Output>((res, rej) => {
      this.client.acceptPayment({ id: userId }, (err, result) => {
        if (err || !result) {
          rej(new Error(err?.message));
          return;
        }
        res(result);
      });
    });
  }
}