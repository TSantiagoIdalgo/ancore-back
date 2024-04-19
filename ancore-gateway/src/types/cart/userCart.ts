import { IProductModel } from '../products/products';

export interface IUserCart{
    id: string;
    userId: string;
    total: number,
    products: IProductModel[];
    isPaid: boolean;
  }

export type ActionCart = 'add' | 'remove' | 'clear'

export enum CartEvents {
  CART_UPDATED = 'CART_UPDATED'
}