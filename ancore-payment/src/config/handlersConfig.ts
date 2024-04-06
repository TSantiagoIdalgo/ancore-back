import PaymentQueryRepository from '../models/payment/paymentQueryRepository';
import PaymentCommandRepository from '../models/payment/paymentCommandRepository';
import PaymentCommandService from '../services/payment/paymentCommandService';
import PaymentCommandController from '../controllers/payment/paymentCommandController';
import Stripe from 'stripe';
import { STRIPE_SECRET } from './api';

const stripe = new Stripe(STRIPE_SECRET);

const paymentQueryRepository = new PaymentQueryRepository();
const paymentCommandRepository = new PaymentCommandRepository(stripe);

const paymentCommandService = new PaymentCommandService(paymentCommandRepository, paymentQueryRepository);

export const paymentCommandController = new PaymentCommandController(paymentCommandService);