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