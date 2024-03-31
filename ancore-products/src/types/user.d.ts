import { Model } from 'sequelize';

export interface IUserModel {
    id: string
    userName: string
    email: string
    password: string
    role: string
    verify?: boolean
    image?: string 
    ban: boolean
}

export interface IUserNetworkLogin {
    email?: string;
    userName?: string;
    image?: string;
}

export interface IUser extends Model<IUserModel>, IUserModel {}