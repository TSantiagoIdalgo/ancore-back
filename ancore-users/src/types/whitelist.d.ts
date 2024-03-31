import { Model } from 'sequelize';

export interface IWhiteList extends Model {
  id?: string;
  userId: string;
  productId: string;
}