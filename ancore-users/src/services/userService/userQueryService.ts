import { API_SECRET } from '../../config/api';
import { IUser, IUserNetworkLogin } from '../../types/user';
import UserQueryRepository from '../../models/user/userQueryRepository';
import UserCommandRepository from '../../models/user/userCommandRepository';
import GRPCErrorHandler from '../../helpers/error';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import * as grpc from '@grpc/grpc-js';
dotenv.config();

export default class UserQueryService {
  private readonly userQueryRepository: UserQueryRepository;
  private readonly userCommandRepository: UserCommandRepository;

  constructor(userQueryRepository: UserQueryRepository, userCommandRepository: UserCommandRepository) {
    this.userQueryRepository = userQueryRepository;
    this.userCommandRepository = userCommandRepository;
  }

  async getUsers () {
    try {
      const users = await this.userQueryRepository.getAll();
      if (users.length === 0) 
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Users not found');
      return users; 
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async getUserById (userId: string) {
    try {
      const user = await this.userQueryRepository.getById(userId);
      if (!user)
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');
      return user;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async Login (email: string, password: string) {
    try {
      const user = await this.userQueryRepository.getById(email);
      
      if (!user || !user.verify || user.ban ) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Email or password are incorrect');
      }

      const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Email or password are incorrect');
      }

      const payload = {
        name: user.userName, 
        email: user.email
      };
      const token = Jwt.sign(payload, API_SECRET);

      return token;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async NetworkLogin (user: IUserNetworkLogin) {
    try {
      if (!user.email || !user.userName) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid argument');

      }
      let userFind = await this.userQueryRepository.getById(user.email);

      if (!userFind) {
        const password = crypto.randomUUID();
        userFind = await this.userCommandRepository.create({ ...user, password } as IUser);
      }

      const token = Jwt.sign({ userName: user.userName, email: user.email }, API_SECRET);

      return token;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}