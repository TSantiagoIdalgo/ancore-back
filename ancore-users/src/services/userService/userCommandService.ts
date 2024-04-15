import { IUser } from '../../types/user';
import * as grpc from '@grpc/grpc-js';
import GRPCErrorHandler from '../../helpers/error';
import UserCommandRepository from '../../models/user/userCommandRepository';

export default class UserCommandService {
  private readonly userCommandRepository: UserCommandRepository;

  constructor(userCommandRepository: UserCommandRepository) {
    this.userCommandRepository = userCommandRepository;
  }

  public createUser(user: IUser) {
    try {
      if (!user.email || !user.userName || !user.password) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');
      }
      return this.userCommandRepository.create(user);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }

  public async updateUser (userId: string, user: IUser ) {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Mising data');
      const userUpdated = await this.userCommandRepository.update(userId, user);
      if (!userUpdated) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Mising data');
      return userUpdated;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }

  public async deleteUser (id: string) {
    try {
      if (!id) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Mising data');
      const userDeleted = await this.userCommandRepository.delete(id);
      if (!userDeleted) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');
      return userDeleted; 
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }

  public async userVerify (token: string) {
    try {
      if (!token) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');
      return await this.userCommandRepository.verify(token);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }

  public userBan (userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Missing data');
      return this.userCommandRepository.banUser(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }
}