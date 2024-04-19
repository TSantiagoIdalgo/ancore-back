import { IProductModel } from './products';

interface IUserCartModel {
  productId: string;
  amount: number
}

export interface IUserCart{
    id: string;
    userId: string;
    total: number,
    products: IUserCartModel[];
    isPaid: boolean;
  }

export interface CartForEmails {
    products: IProductModel[];
    total: number;
    isPaid: boolean
}