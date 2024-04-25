import { ProtoGrpcType } from '../proto/out/users';
import { UserServiceHandlers } from '../proto/out/UserPackage/UserService';
import { UserProductServiceHandlers } from '../proto/out/UserPackage/UserProductService';
import { UserFavsServiceHandlers } from '../proto/out/UserPackage/UserFavsService';
import path from 'path';
import * as handlers from './config/handlersConfig';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const server = new grpc.Server();
const PROTO_PATH = '../proto/users.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PATH));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
const userPackage = grpcObj.UserPackage;

export function ServerHandlers () {
  server.addService(userPackage.UserService.service, {
    getAllUsers: (call, callback) => { 
      handlers.userQueryController.getAllUser(call, callback); 
    },
    getUserById: (call, callback) => { 
      handlers.userQueryController.getUserById(call, callback); 
    },
    getUserLogin: (call, callback) => {
      handlers.userQueryController.userLogin(call, callback); 
    },
    GetUserNetworkLogin: (call, callback) => { 
      handlers.userQueryController.userNetworkLogin(call, callback); 
    },

    createUser: (call, callback) => { 
      handlers.userCommandController.createUser(call, callback); 
    },
    updateUser: (call, callback) => { 
      handlers.userCommandController.updateUser(call, callback); 
    },
    deleteUser: (call, callback) => { 
      handlers.userCommandController.deleteUser(call, callback); 
    },
    verifyUser: (call, callback) => { 
      handlers.userCommandController.verifyUser(call, callback); 
    },
    userBan: (call, callback) => {
      handlers.userCommandController.userBan(call, callback); 
    }, 
  } as UserServiceHandlers);

  server.addService(userPackage.UserProductService.service, {
    getAllProducts: (call, callback) => { 
      handlers.cartQueryController.getUserCart(call, callback); 
    },
    getUserPaidProducts: (call, callback) => {
      handlers.cartQueryController.getUserPaidProducts(call, callback);
    },

    updateCart: (call) => {
      handlers.cartCommandController.addProductToCart(call);
    }
  } as UserProductServiceHandlers);

  server.addService(userPackage.UserFavsService.service, {
    getAllUserFavs: (call, callback) => { 
      handlers.whitelistQueryController.getUserWhiteLis(call, callback); 
    },
    addToFavs: (call, callback) => { 
      handlers.whitelistCommandController.addProductToWhiteList(call, callback); 
    },
    deleteFav: (call, callback) => { 
      handlers.whitelistCommandController.removeProductFromWhitelist(call, callback); 
    }
  } as UserFavsServiceHandlers);
}

export default server;