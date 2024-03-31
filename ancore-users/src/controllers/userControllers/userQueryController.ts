import * as protoTypes from '../../types/proto';
import * as grpc from '@grpc/grpc-js';
import GRPCErrorHandler from '../../helpers/error';
import UserQueryService from '../../services/userService/userQueryService';

export default class UserQueryController {
  private userQueryService: UserQueryService;

  constructor(userQueryService: UserQueryService) {
    this.userQueryService = userQueryService;
  }

  public async getAllUser (_req: protoTypes.getAllRequest, res: protoTypes.getAllResponse) {
    try {
      const users = await this.userQueryService.getUsers();
      if (users.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Users not found');
      }
      res(null, { users });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getUserById (req: protoTypes.getByIdRequest, res: protoTypes.getByIdResponse) {
    try {
      const { id } = req.request;
      if (!id) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');

      const user = await this.userQueryService.getUserById(id);
      if (!user) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');
      
      res(null, user);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async userLogin (req: protoTypes.loginRequest, res: protoTypes.loginResponse) {
    try {
      const { email, password } = req.request;
      if (!email || !password) 
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');
    
      const userToken = await this.userQueryService.Login(email, password);
      
      res(null, { token: userToken });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async userNetworkLogin (req: protoTypes.networkLoginRequest, res: protoTypes.networkLoginResponse) {
    try {
      const user = req.request;
      const userToken = await this.userQueryService.NetworkLogin(user);
    
      res(null, { token: userToken });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) res(error);
      else res(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}