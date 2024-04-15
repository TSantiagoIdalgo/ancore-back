import * as grpc from '@grpc/grpc-js';
import { sendVerifyMail } from '../../mailService/mail/mail.services';
import { API_SECRET } from '../../config/api';
import { IUser } from '../../types/user';
import UserModel from '../../database/sql/tables/userModel';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import GRPCErrorHandler from '../../helpers/error';

export default class UserCommandRepository {
  public async create (user: IUser): Promise<IUser> {
    const { userName, email, password, image } = user;
    const userFind = await UserModel.findOne({ where: { email } });
    if (userFind) throw new GRPCErrorHandler(grpc.status.ALREADY_EXISTS, 'User already exists');
    
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
    let newPassword: string;
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(user.password, salt);
    } else newPassword = userFind.password;

    userFind.set({ ...user, password: newPassword });
    await userFind.save();

    return userFind;
  }

  public async delete (userId: string): Promise<IUser | null> {
    const userFind = await UserModel.findByPk(userId);
    if (!userFind) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

    UserModel.destroy({ where: { email: userId } });

    return userFind;
  }

  public async verify (token: string): Promise<IUser> {
    const user = Jwt.verify(token, process.env.SECRET as string) as IUser;
    if (!user) throw new GRPCErrorHandler(401, 'UNAUTHORIZED');

    const userFind = await UserModel.findOne({ where: { email: user.email }});
    if (!userFind) throw new GRPCErrorHandler(404, 'User not found');
    
    userFind.verify = true;
    userFind.save();

    return userFind;
  }

  public async banUser (userId: string): Promise<IUser> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User not found');

    user.ban = !user.ban;
    return await user.save();
  }
}