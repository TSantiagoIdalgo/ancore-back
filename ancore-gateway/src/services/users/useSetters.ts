import { UserServiceClient } from '../../../proto/out/UserPackage/UserService';
import { User, User__Output } from '../../../proto/out/UserPackage/User';
import GRPCErrorHandler from '../../helpers/error';

export default class UserSetters {
  private readonly client: UserServiceClient;

  constructor(userService: UserServiceClient) {
    this.client = userService;
  }

  public async createUser (user: User): Promise<User__Output> {
    return new Promise<User__Output>((res, rej) => {
      this.client.createUser(user, (err, result) => {
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

  public async updateUser (userId: string, user: User): Promise<User__Output> {
    return new Promise<User__Output>((res, rej) => {
      this.client.updateUser({ user, userId }, (err, result) => {
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

  public async deleteUser (userId: string): Promise<User__Output> {
    return new Promise<User__Output>((res, rej) => {
      this.client.deleteUser({ id: userId }, (err, result) => {
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

  public async userVerify (token: string): Promise<User__Output> {
    return new Promise<User__Output>((res, rej) => {
      this.client.verifyUser({ id: token }, (err, result) => {
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

  public async userBan (userId: string): Promise<User__Output> {
    return new Promise<User__Output>((res, rej) => {
      this.client.userBan({ id: userId }, (err, result) => {
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