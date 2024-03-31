import { Model } from 'sequelize';

export interface UserSession extends Model {
    userId: string;
    csrf: string;
    createdAt: Date;
}