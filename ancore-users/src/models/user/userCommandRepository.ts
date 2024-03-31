import * as grpc from '@grpc/grpc-js';
import { sendVerifyMail } from '../../mailService/mail/mail.services';
import { API_SECRET } from '../../config/api';
import { IUser } from '../../types/user';
import UserModel from '../../database/sql/tables/userModel';
import UserSessionModel from '../../database/sql/tables/userSession';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import GRPCErrorHandler from '../../helpers/error';

export default class UserCommandRepository {
  public async create (user: IUser): Promise<IUser> {
    const { userName, email, password, image } = user;
    const userFind = await UserModel.findOne({ where: { email } });
    if (userFind) throw new Error('User already exists');
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      userName,
      email,
      password: passwordHash,
      verify: false,
      image: image ? image : null
    });

    const token = Jwt.sign({ email }, API_SECRET);
    await sendVerifyMail(email, userName, token);

    return newUser;
  }

  public async update (userId: string, user: IUser): Promise<IUser> {
    const userFind = await UserModel.findByPk(userId);
    if (!userFind) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');
    userFind.set(user);
    await userFind.save();

    return userFind;
  }

  public delete (userId: string): Promise<IUser | null> {
    const userFind = UserModel.findByPk(userId);
    if (!userFind) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

    UserModel.destroy({ where: { id: userId } });

    return userFind;
  }

  public async verify (userId: string): Promise<IUser> {
    const userFind = await UserModel.findOne({ where: { email: userId } });
    if (!userFind) throw new GRPCErrorHandler(grpc.status.UNAUTHENTICATED, 'Invalid token');

    userFind.verify = true;
    userFind.save();

    return userFind;
  }

  public async saveSession (csrf: string, userId: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    await UserSessionModel.create({ user: userId, token: csrf, expiresAt: expiresAt });
  }

  public async banUser (userId: string): Promise<IUser> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

    user.ban = true;
    return await user.save();
  }
}