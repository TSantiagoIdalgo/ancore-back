import PaymentMethods from './paymentMethods';
import express, { Router } from 'express';

const paymentRouter = Router();
const paymentMethods = new PaymentMethods();

paymentRouter.post('/create', paymentMethods.newPayment);

paymentRouter.post('/accept', express.json(), paymentMethods.acceptPaymentMethod);

export default paymentRouter;