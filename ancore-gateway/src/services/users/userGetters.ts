import { UserServiceClient } from '../../../proto/out/UserPackage/UserService';
import { User__Output } from '../../../proto/out/UserPackage/User';
import { Users__Output } from '../../../proto/out/UserPackage/Users';
import { LoginResponse__Output } from '../../../proto/out/UserPackage/LoginResponse';
import GRPCErrorHandler from '../../helpers/error';

export default class UserGetters {
  private readonly client: UserServiceClient;

  constructor(userService: UserServiceClient) {
    this.client = userService;
  }

  public getUsers(): Promise<Users__Output> {
    return new Promise<Users__Output>((res, rej) => {
      this.client.getAllUsers({}, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public getUser(id: string): Promise<User__Output> {
    return new Promise<User__Output>((res, rej) => {
      this.client.getUserById({ id }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public getUserLogin (email: string, password: string): Promise<LoginResponse__Output> {
    return new Promise<LoginResponse__Output>((res, rej) => {
      this.client.getUserLogin({ email, password }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public getUserNetworkLogin (email: string, password: string, image: string | undefined): Promise<LoginResponse__Output> {
    return new Promise<LoginResponse__Output>((res, rej) => {
      this.client.getUserNetworkLogin({ email, password, image }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }
}