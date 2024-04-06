import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { UserId__Output } from '../../proto/out/PaymentPackage/UserId';
import { PaymentURL } from '../../proto/out/PaymentPackage/PaymentURL';
import { CartParameters__Output } from '../../proto/out/PaymentPackage/CartParameters';
import { UserProduct } from '../../proto/out/PaymentPackage/UserProduct';

export type CreatePayment = ServerUnaryCall<UserId__Output, PaymentURL>
export type CreatePaymentResponse = sendUnaryData<PaymentURL>

export type AcceptPayment = ServerUnaryCall<CartParameters__Output, UserProduct>
export type AcceptPaymentResponse = sendUnaryData<UserProduct>