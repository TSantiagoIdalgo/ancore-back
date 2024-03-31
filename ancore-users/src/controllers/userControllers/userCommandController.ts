import GRPCErrorHandler from '../../helpers/error';
import UserCommandService from '../../services/userService/userCommandService';
import * as PT from '../../types/proto';
import * as grpc from '@grpc/grpc-js';
import { IUser } from '../../types/user';

export default class UserCommandController {
  private readonly userCommandService: UserCommandService;

  constructor(userCommandService: UserCommandService) {
    this.userCommandService = userCommandService;
  }

  public async createUser (req: PT.userCreateRequest, res: PT.userCreateResponse) {
    try {
      const user = req.request as IUser;

      if (!user.userName || !user.email || !user.password)
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Mising data');

      const newUser = await this.userCommandService.createUser(user);
      res(null, newUser);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
  
  public async updateUser (req: PT.updateRequest, res: PT.updateResponse) {
    try {
      const { userId, user } = req.request;
      if (userId === undefined) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'UserId is required');
      }
      
      const userUpdated = await this.userCommandService.updateUser(userId, user as IUser);
      if (userUpdated === null ) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');
      }
      res(null, userUpdated);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async deleteUser (req: PT.deleteRequest, res: PT.deleteResponse) {
    const { id } = req.request;
    try {
      if (id === undefined) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'UserId is required');
      }

      const user = await this.userCommandService.deleteUser(id);
      if (user === null) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');
      }

      res(null, user);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async verifyUser (req: PT.verifyRequest, res: PT.verifyResponse) {
    const { id } = req.request;
    try {
      if (id === undefined || typeof id !== 'string') {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'userId is required');
      }
      
      const user = await this.userCommandService.userVerify(id);

      res(null, user);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async userBan (req: PT.banRequest, res: PT.banResponse) {
    try {
      const { id } = req.request;
      if (id === undefined || typeof id !== 'string') {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'userId is required');
      }

      const user = await this.userCommandService.userBan(id);
      if (!user) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

      res(null, user);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}