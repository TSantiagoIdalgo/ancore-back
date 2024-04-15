import { IProductModel } from '../products/products';

interface IUserCartModel {
  productId: string;
  amount: number
}

export interface IUserCart{
    id: string;
    userId: string;
    total: number,
    products: IProductModel[];
    isPaid: boolean;
  }