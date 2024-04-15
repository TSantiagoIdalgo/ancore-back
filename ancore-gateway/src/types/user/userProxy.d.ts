import { User__Output } from '../../../proto/out/UserPackage/User';
import { ServerContext } from '../serverTypes';
import { ILogin } from './userService';

export interface IUserProxy {
    getAllUsers(): Promise<User__Output[]>;
    getUserById(userId: string, context: ServerContext): Promise<User__Output>;
    getUserLogin(user: ILogin, context: ServerContext): Promise<string>;
    verifyUser(token: string): Promise<User__Output>;
    createUser(user: IUser): Promise<User__Output>;
    updateUser(userId: string, context: ServerContext, user: IUser): Promise<User__Output>;
    deleteUser(userId: string, context: ServerContext): Promise<User__Output>;
    userBan(userId: string, context: ServerContext): Promise<User__Output>
}