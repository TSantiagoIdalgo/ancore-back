import { ProtoGrpcType } from './proto/out/users';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Users__Output } from './proto/out/UserPackage/Users';

const PROTO_PATH = './proto/users.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PATH));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;

const client = new grpcObj.UserPackage.UserService(
  '0.0.0.0:8081', grpc.credentials.createInsecure()
);


const deadLine = new Date();
deadLine.setSeconds(deadLine.getSeconds() + 5);
client.waitForReady(deadLine, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  getUserById();
});

function getUserById () {
  return new Promise<Users__Output>((res, rej) => {
    client.getAllUsers({ }, (err, result) => {
      if (err || !result) {
        rej(err);
        return;
      }
      console.log(result);
      res(result);
    });
  }); 
}
