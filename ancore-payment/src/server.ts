import { ProtoGrpcType } from '../proto/out/payment';
import { PaymentServiceHandlers } from '../proto/out/PaymentPackage/PaymentService';
import path from 'path';
import * as handlers from './config/handlersConfig';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const server = new grpc.Server();
const PROTO_PATH = '../proto/payment.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PATH));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
const paymentPackage = grpcObj.PaymentPackage;

export function ServerHandlers () {
  server.addService(paymentPackage.PaymentService.service, {
    createPayment: (call, callback) => { 
      handlers.paymentCommandController.createPayment(call, callback);
    },
    acceptPayment: (call, callback) => { 
      handlers.paymentCommandController.acceptPayment(call, callback); 
    }
  } as PaymentServiceHandlers);
}

export default server;