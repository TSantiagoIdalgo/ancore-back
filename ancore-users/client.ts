import { ProtoGrpcType } from './proto/out/users';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PORT = process.env.PORT ?? 8082;
const PROTO_PATH = './proto/users.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PATH));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;

const client = new grpcObj.UserPackage.UserService(
  `0.0.0.0:${PORT}`, grpc.credentials.createInsecure()
);


const deadLine = new Date();
deadLine.setSeconds(deadLine.getSeconds() + 5);
client.waitForReady(deadLine, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  onClientReady();
});

function onClientReady () {
  client.getAllUsers({}, (err, res) => {
    console.log(res, err);
    return res;
  }
  );
}