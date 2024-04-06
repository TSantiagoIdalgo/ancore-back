import { IProductModel } from './products';

export interface IUserCart{
    id: string;
    userId: string;
    total: number,
    products: IProductModel[];
    isPaid: boolean;
  }