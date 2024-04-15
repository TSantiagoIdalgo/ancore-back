import { USERS_PORT, PAYMENT_PORT, PRODUCTS_PORT } from './api';
import * as ProtoUsersTypes from '../../proto/out/users';
import * as ProtoProductsTypes from '../../proto/out/products';
import * as ProtoPaymentTypes from '../../proto/out/payment';
import * as grpc from '@grpc/grpc-js';
import * as path from 'path';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_USERS = '../../proto/users.proto';
const PROTO_PRODUCTS = '../../proto/products.proto';
const PROTO_PAYMENT = '../../proto/payment.proto';


// User microservice, on port 8081

const userPackageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_USERS));
const userObj = (grpc.loadPackageDefinition(userPackageDef) as unknown) as ProtoUsersTypes.ProtoGrpcType;

export const userClient = new userObj.UserPackage.UserService(
  `0.0.0.0:${USERS_PORT}`, grpc.credentials.createInsecure()
);

export const whitelistClient = new userObj.UserPackage.UserFavsService(
  `0.0.0.0:${USERS_PORT}`, grpc.credentials.createInsecure()
);

export const cartClient = new userObj.UserPackage.UserProductService(
  `0.0.0.0:${USERS_PORT}`, grpc.credentials.createInsecure()
);


// Product microservice, on port 8082

const productPackageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PRODUCTS));
const productObj = (grpc.loadPackageDefinition(productPackageDef) as unknown) as ProtoProductsTypes.ProtoGrpcType;

export const productClient = new productObj.ProductsPackage.ProductsService(
  `0.0.0.0:${PRODUCTS_PORT}`, grpc.credentials.createInsecure()
);

export const reviewClient = new productObj.ProductsPackage.ReviewsService(
  `0.0.0.0:${PRODUCTS_PORT}`, grpc.credentials.createInsecure()
);


// Payment microservice, on port 8083

const paymentPackageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PAYMENT));
const paymentObj = (grpc.loadPackageDefinition(paymentPackageDef) as unknown) as ProtoPaymentTypes.ProtoGrpcType;

export const paymentClient = new paymentObj.PaymentPackage.PaymentService(
  `0.0.0.0:${PAYMENT_PORT}`, grpc.credentials.createInsecure()
);