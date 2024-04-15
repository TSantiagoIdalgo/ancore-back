/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from '@grpc/grpc-js';

class GRPCErrorHandler extends Error {
  name: string;
  code: grpc.status;
  message: string;
  metadata: grpc.Metadata;
  details?: any;

  constructor(code: number, message: string, details?: any) {
    super();
    this.name = code.toString();
    this.message = message;
    this.code = code;
    this.metadata = new grpc.Metadata();
    this.details = details ? this.metadata.add('details', JSON.stringify(this.details)) : null;
  }
}

export default GRPCErrorHandler;
